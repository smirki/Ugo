FROM python:3.9-slim
WORKDIR /app
COPY ./flask_api/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY ./flask_api /app
CMD ["python", "main.py"]
