# SmartBus TN Backend

This is a standalone, basic FastAPI backend for the SmartBus TN project. It provides REST API endpoints to receive and serve GPS and occupancy data for buses.

## Prerequisites
- Python 3.8+

## Setup

1. **Navigate to this directory:**
   ```bash
   cd backend
   ```

2. **(Optional) Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI application with Uvicorn:

```bash
uvicorn main:app --reload
```

The server will be available at `http://localhost:8000`.

## API Documentation & Testing

FastAPI automatically generates interactive API documentation. Once the server is running, you can test all endpoints directly from your browser:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Endpoints

- `POST /gps`: Submit a GPS update for a bus.
- `POST /occupancy`: Submit an occupancy update for a bus.
- `GET /bus/{bus_id}`: Retrieve the latest state (GPS + occupancy) for a specific bus.
- `GET /buses`: Retrieve the latest state for all known buses.

### Testing with `curl`

**POST a GPS update:**
```bash
curl -X 'POST' \
  'http://localhost:8000/gps' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bus_id": "TN-01-AB-1234",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "speed": 45.5,
  "timestamp": "2023-10-27T10:00:00Z"
}'
```

**POST an occupancy update:**
```bash
curl -X 'POST' \
  'http://localhost:8000/occupancy' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bus_id": "TN-01-AB-1234",
  "passenger_count": 25,
  "available_seats": 15,
  "timestamp": "2023-10-27T10:01:00Z"
}'
```

**GET the latest bus state:**
```bash
curl -X 'GET' \
  'http://localhost:8000/bus/TN-01-AB-1234' \
  -H 'accept: application/json'
```
