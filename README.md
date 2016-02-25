# chat-app
Simple chat application built using angular-fullstack. Design based on Whatsapp Web using Angular Material. Communication via Socket.io.

#Features
- Groups
- Scribbles
- Group/Profile images stored on AWS S3 Bucket
- Real time communication
- User status message
- Persistent Messages
- New users and groups get assigned a random image, if no image is available default will be used as set in environment variables

#To-Do
- Send attachments
- Emojis
- Notification when added to new group.
- Notification when message is received from new conversation.
- Filter group messages for users that just joined a group.
- Paginate conversation messages

#Environment Variables Needed
- DOMAIN <!-- http://localhost:9000 -->
- SESSION_SECRET <!-- chat-secret -->
- BUCKET <!-- bucket-name -->
- BUCKET_URL <!-- https://s3.amazonaws.com/bucket-name/ -->
- BUCKET_URL_UPLOADS <!-- https://s3.amazonaws.com/bucket-name/uploads-dir/ -->
- BUCKET_DEFAULT_USER_IMAGE <!-- 'default/image.jpg', relative to BUCKER_URL -->
- BUCKET_DEFAULT_GROU_IMAGE <!-- 'default/image.jpg', relative to BUCKER_URL -->
- AWS_ACCESSKEYID
- AWS_SECRETACCESSKEY
- AWS_API_VERSION <!-- 2006-03-01 -->
- IMAGE_MAX_SIZE <!-- size in bytes -->
