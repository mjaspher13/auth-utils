{
  "name": "bff-common",
  "projectType": "application",
  "sourceRoot": "apps/bff-common/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "sh -c 'entity=$(echo $@ | sed -n \"s/.*--entity=\\([^ ]*\\).*/\\1/p\"); echo Building for entity: $entity; if [ \"$entity\" = \"slgfi\" ]; then cp apps/bff-common/src/environments/environment.slgfi.ts apps/bff-common/src/environments/environment.ts && mv apps/bff-common/src/environments/environment.slgfi.ts.bak apps/bff-common/src/environments/environment.ts.bak; else cp apps/bff-common/src/environments/environment.dev.ts apps/bff-common/src/environments/environment.ts && mv apps/bff-common/src/environments/environment.dev.ts.bak apps/bff-common/src/environments/environment.ts.bak; fi; vite build' > build-log.txt 2>&1"
      }
    },
    "dev": {
      "executor": "nx:run-commands",
      "options": {
        "command": "sh -c 'entity=$(echo $@ | sed -n \"s/.*--entity=\\([^ ]*\\).*/\\1/p\"); echo Building for entity: $entity; if [ \"$entity\" = \"slgfi\" ]; then cp apps/bff-common/src/environments/environment.slgfi.ts apps/bff-common/src/environments/environment.ts && mv apps/bff-common/src/environments/environment.slgfi.ts.bak apps/bff-common/src/environments/environment.ts.bak; else cp apps/bff-common/src/environments/environment.dev.ts apps/bff-common/src/environments/environment.ts && mv apps/bff-common/src/environments/environment.dev.ts.bak apps/bff-common/src/environments/environment.ts.bak; fi; vite build' > dev-log.txt 2>&1"
      }
    }
  }
}
