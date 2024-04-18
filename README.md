This is my REST API for file managment. All uploaded files are stored in AWS S3Bucket. Server provide only URL to this files.

On

>GET api/filesystem

will return list of files and folders.

>GET api/filesystem/:filepath

will return URL of file. To get URL of a file, which is located in folder, describe path to that file in URL. (f.e. path/to/file.txt)

>POST /api/filesystem/:filepath

will upload file to S3Bucket. Maximum file size is 10 MB. You can save file into a folder by descibing path to the folder in 'filepath'. If there are no such folder/folders, it will create new one. If 'filepath' is empty, file will be saved outside of folder.

>DEl /api/filesystem/:filepath

will delete file or entire folder described in 'filepath'