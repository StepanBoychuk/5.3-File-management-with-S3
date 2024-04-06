This is my REST API for file managment. All uploaded files are stored in AWS S3Bucket. Server provide only URL to this files

On

>GET api/files

will return list of file names and file URLs.  This endpoint has two query parameters such as **page**(by default is set to 0) and **amount**(by default is set to 3)

>GET api/files/:id

will return data about file with this id

>POST /api/files

will upload file to S3Bucket. Maximum file size is 10 MB

>DEl /api/files/:id

will delete file with this id from S3Bucket and delete data about this file from database