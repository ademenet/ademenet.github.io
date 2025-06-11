---
title: "TIL how to mount S3 bucket on Windows"
author: "Alain Demenet"
slug: "mount-s3-on-windows"
date: "2023-03-22"
tags:
  - TIL
---

## Setting up everything

Install rclone and winfsp using [Chocolatey](https://chocolatey.org/):

```powershell
choco install winfsp
choco install rclone
```

Create a policy to access your S3 bucket `my-bucket`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::my-bucket"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-bucket/my-folder/*"
    }
  ]
}
```

Create a user IAM and attach the policy.

Generate a key pair.

To setup the key in environment variables you can use the following Powershell:

```powershell
$Env:AWS_ACCESS_KEY_ID = "your_access_key_id"
$Env:AWS_SECRET_ACCESS_KEY = "your_secret_access_key"
```

In order to list all environment variable:

```powershell
Get-ChildItem Env:
```

## Mounting the S3 bucket

We need to update the rclone configuration file at `C:\Users\Administrator\AppData\Roaming\rclone\rclone.conf`:

```
[aws_s3]
type = s3
provider = AWS
env_auth = false
region = eu-west-3
access_key_id = your_access_key_id
secret_access_key = your_secret_access_key
```

> To get content: `Get-Content C:\Users\Administrator\AppData\Roaming\rclone\rclone.conf`

In order to mount the S3 bucket:

```powershell
rclone mount aws_s3:my-bucket/my-folder S: --vfs-cache-mode full
```

rclone can not be run in background according to the [documentation](https://rclone.org/commands/rclone_mount/):

> On Windows you can run mount in foreground only, the flag is ignored.

To bypass this we can run and hide the Powershell window:

```
Start-Process powershell.exe -ArgumentList '-Command "rclone mount aws_s3:my-bucket/my-folder S: --vfs-cache-mode full > nul"' -WindowStyle Hidden
```

You are done!

# Ressources

- https://blog.spikeseed.cloud/mount-s3-as-a-disk/
