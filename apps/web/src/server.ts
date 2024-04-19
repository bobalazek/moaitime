import { join } from 'path';
import { parseArgs } from 'util';

// This is our temporary web server, which should be enough for local usage.
// The reason we need it and not use "serve" like we originally did is,
// because we need to inject the global variables into the HTML file.
// Will implement a proper solution later.

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

const publicDirectory = 'public';
const port = parseInt(values.port ?? '3000');
const allowedEnvironmentVariables = ['API_URL', 'OAUTH_GOOGLE_CLIENT_ID'];

Bun.serve({
  port,
  async fetch(request: Request) {
    const url = new URL(request.url);
    const { pathname } = url;

    console.log(`Fetching path: ${pathname}`);

    const indexFilePath = join(publicDirectory, 'index.html');

    let pathnameFilePath = join(publicDirectory, pathname);
    let file = Bun.file(pathnameFilePath);

    const fileExists = await file.exists();
    if (!fileExists) {
      pathnameFilePath = indexFilePath;
      file = Bun.file(pathnameFilePath);
    }

    console.log(process.env);

    let content = await file.text();
    if (pathnameFilePath === indexFilePath) {
      const globals = allowedEnvironmentVariables.reduce((acc, key) => {
        const value = process.env[key];
        if (value) {
          acc[key] = value;
        }

        return acc;
      }, {});

      content = content.replace(
        '<!-- injected globals script -->',
        `<script>
          window.globals = ${JSON.stringify(globals)};
        </script>
        </head>`
      );
    }

    return new Response(content, {
      headers: {
        'content-type': file.type,
      },
    });
  },
});

console.log(`Server running on http://localhost:${port}`);
