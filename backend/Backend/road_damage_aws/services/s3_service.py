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

# Initialize S3 Client — required, no local fallback
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and AWS_S3_BUCKET_NAME:
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
else:
    s3_client = None
    print("⚠️  WARNING: AWS S3 credentials not configured in .env — uploads will fail.")


async def upload_image_to_s3(file: UploadFile) -> str:
    """Uploads an image to AWS S3 and returns the public URL."""
    if not s3_client:
        raise Exception("AWS S3 is not configured. Please set credentials in .env file.")

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    try:
        file_content = await file.read()
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET_NAME,
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type
        )
        await file.seek(0)
        return f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"

    except NoCredentialsError:
        raise Exception("AWS credentials not found.")
    except ClientError as e:
        raise Exception(f"Failed to upload to S3: {str(e)}")
    except Exception as e:
        raise Exception(f"An error occurred uploading to AWS S3: {str(e)}")


async def upload_bytes_to_s3(file_bytes: bytes, extension: str = "jpg", content_type: str = "image/jpeg") -> str:
    """Uploads raw image bytes to AWS S3 and returns the public URL."""
    if not s3_client:
        raise Exception("AWS S3 is not configured. Please set credentials in .env file.")

    unique_filename = f"annotated_{uuid.uuid4()}.{extension}"

    try:
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET_NAME,
            Key=unique_filename,
            Body=file_bytes,
            ContentType=content_type
        )
        return f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
    except Exception as e:
        raise Exception(f"S3 upload failed: {str(e)}")


async def upload_video_to_s3(file: UploadFile) -> str:
    """Uploads a video file to AWS S3 and returns the public URL."""
    if not s3_client:
        raise Exception("AWS S3 is not configured. Please set credentials in .env file.")

    file_extension = file.filename.split(".")[-1].lower() if "." in file.filename else "mp4"
    unique_filename = f"videos/{uuid.uuid4()}.{file_extension}"

    content_type_map = {
        "mp4": "video/mp4", "avi": "video/x-msvideo",
        "mov": "video/quicktime", "webm": "video/webm", "mkv": "video/x-matroska",
    }
    content_type = content_type_map.get(file_extension, "video/mp4")

    await file.seek(0)
    file_content = await file.read()
    await file.seek(0)

    try:
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET_NAME,
            Key=unique_filename,
            Body=file_content,
            ContentType=content_type
        )
        return f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
    except Exception as e:
        raise Exception(f"S3 video upload failed: {str(e)}")
