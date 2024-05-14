ROOT_DIR=${ROOT_DIR:-$(pwd)}
NODE_ENV=${NODE_ENV:-production}
ENV_GENERATED_FILE_PATH="$ROOT_DIR/.env.generated"

echo "" > $ENV_GENERATED_FILE_PATH

processed_vars=""
files=(".env.$NODE_ENV.local" ".env.local" ".env.$NODE_ENV" ".env")
for file in "${files[@]}"; do
  envFilePath="$ROOT_DIR/$file"

  if ! [[ -f "$envFilePath" ]]; then
    continue
  fi

  echo "Loading environment variables from $envFilePath into .env.generated ..."
  while IFS='' read -r line || [[ -n "$line" ]]; do
    if [[ -z "$line" || "$line" =~ ^\#.* ]]; then
      continue
    fi

    key=${line%%=*}

    if [[ $processed_keys == *"|$key|"* ]]; then
      echo "Skipping $key as it's already been added."
      continue
    fi

    processed_keys+="|$key| "

    echo "$line" >> $ENV_GENERATED_FILE_PATH

    echo "Added $line to .env.generated"
  done < "$envFilePath"
done
