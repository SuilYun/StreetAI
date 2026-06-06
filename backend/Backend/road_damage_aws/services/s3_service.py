import os
import uuid
from fastapi import UploadFile
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")

# Initialize S3 Client
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and AWS_S3_BUCKET_NAME:
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
else:
    s3_client = None


async def upload_image_to_s3(file: UploadFile) -> str:
    """Uploads an image to AWS S3 and returns the public URL. Falls back to local storage if S3 is not configured."""
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    if not s3_client:
        # Save locally to uploads directory
        # The uploads folder will be located in the backend root directory (next to main.py)
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, unique_filename)
        
        file_content = await file.read()
        with open(file_path, "wb") as f:
            f.write(file_content)
            
        await file.seek(0)
        return f"/uploads/{unique_filename}"

    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to S3 Bucket
        # We explicitly set ContentType for proper browser rendering when served
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET_NAME,
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type
        )
        
        # Reset file pointer for any subsequent reads locally
        await file.seek(0)
        
        # Generate and return public AWS S3 URL
        # Note: This assumes the bucket is Public. If using private buckets, you might need generate_presigned_url
        public_url = f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
        return public_url
        
    except NoCredentialsError:
        raise Exception("AWS credentials not found.")
    except ClientError as e:
        raise Exception(f"Failed to upload to S3: {str(e)}")
    except Exception as e:
        raise Exception(f"An error occurred uploading to AWS S3: {str(e)}")
