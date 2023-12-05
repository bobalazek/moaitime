import * as nodemailer from 'nodemailer';

export function configureTransporter(url: string) {
  const isSecure = url.startsWith('smtps://');
  const protocol = isSecure ? 'smtps' : 'smtp';
  const urlWithoutProtocol = url.replace(`${protocol}://`, '');

  const lastAtSignIndex = urlWithoutProtocol.lastIndexOf('@');
  if (lastAtSignIndex === -1) {
    throw new Error('Invalid SMTP URL format');
  }

  const credentials = urlWithoutProtocol.substring(0, lastAtSignIndex);
  const hostAndPort = urlWithoutProtocol.substring(lastAtSignIndex + 1);

  const [username, password] = credentials.split(':');
  const [host, port] = hostAndPort.split(':');

  const transporterOptions = {
    host,
    port: parseInt(port, 10),
    secure: isSecure,
    auth: {
      user: decodeURIComponent(username),
      pass: password,
    },
  };

  console.log(transporterOptions);

  return nodemailer.createTransport(transporterOptions);
}
