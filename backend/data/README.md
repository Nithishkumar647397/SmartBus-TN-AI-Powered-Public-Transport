# CSV Data Files for SmartBus TN

Place your CSV files in this directory (`backend/data/`) or pass their custom paths directly to `seed.py`.

### Expected File Names & Schema:

#### 1. `stops.csv` (Default: `backend/data/stops.csv`)
Columns:
- `id` (e.g., `STOP_1`, `1`)
- `name` (e.g., `Guindy Central`, `Karur Bus Stand`)
- `lat` (latitude as float, e.g., `13.0067`)
- `lng` (longitude as float, e.g., `80.2206`)

#### 2. `routes.csv` (Default: `backend/data/routes.csv`)
Columns:
- `id` (e.g., `101A`, `570`)
- `route_number` (optional, e.g., `101A`)
- `name` (optional, e.g., `Guindy to Karur`)
- `origin` (optional, e.g., `Guindy`)
- `destination` (optional, e.g., `Karur`)
- `service_type` (optional: `normal`, `express`, `point_to_point`)

#### 3. `route_stops.csv` (Default: `backend/data/route_stops.csv`)
Columns:
- `route_id` (foreign key to `routes.id`)
- `stop_id` (foreign key to `stops.id`)
- `sequence` (integer 1, 2, 3...)
- `scheduled_offset_minutes` (integer minutes offset from departure, e.g., 0, 15, 30)

#### 4. `buses.csv` (Optional, Default: `backend/data/buses.csv`)
Columns:
- `id` (e.g., `TN-33-N-1234`)
- `route_id` (foreign key to `routes.id`)
- `capacity` (integer seating capacity, e.g., 50)

### Running the Seed Script:

From the `backend/` directory:
```bash
# Using default paths:
python seed.py

# Using explicit paths:
python seed.py --routes path/to/routes.csv --stops path/to/stops.csv --route-stops path/to/route_stops.csv --buses path/to/buses.csv

# Clear existing database records before seeding:
python seed.py --clear
```
