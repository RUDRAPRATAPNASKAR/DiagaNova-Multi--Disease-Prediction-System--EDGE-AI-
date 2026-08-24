import os
import requests
from dotenv import load_dotenv

load_dotenv()

CHANNEL_ID = os.getenv("THINGSPEAK_CHANNEL_ID")
READ_API_KEY = os.getenv("THINGSPEAK_READ_API_KEY")

BASE_URL = f"https://api.thingspeak.com/channels/{CHANNEL_ID}"


def get_latest_record():

    url = f"{BASE_URL}/feeds/last.json"

    params = {
        "api_key": READ_API_KEY
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()


def get_all_records(limit=100):

    url = f"{BASE_URL}/feeds.json"

    params = {
        "api_key": READ_API_KEY,
        "results": limit
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()