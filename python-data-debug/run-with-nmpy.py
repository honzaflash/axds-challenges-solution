import numpy as np
# import pandas as pd
import math


def run():

    DATA_PATH = 'data.csv'
    
    # Mapping column names to the input data.
    #  * Column 1 - time
    #  * Column 2 - humidity
    #  * Column 3 - salinity
    #  * Column 4 - air_temperature
    #  * Column 5 - water_temperature
    #  * Column 6 - wind_speed

    COLUMN_NAMES = [
        "time",
        "humidity",
        "salinity",
        "air_temperature",
        "water_temperature",
        "wind_speed"
    ]

    SKIP_COLS = 1 # skip this many first columns

    start = time.perf_counter()
    # Load data from a local CSV file into an narray
    data = np.loadtxt(DATA_PATH, delimiter=',', usecols=tuple(range(SKIP_COLS, len(COLUMN_NAMES))))
    loaded = time.perf_counter()
    # Mask the `nan` values
    without_nans = np.ma.masked_array(data, np.isnan(data))
    masked = time.perf_counter()
    # Calculate the average of each column
    averages = np.average(without_nans, axis=0)
    averaged = time.perf_counter()

    print(f"reading into an array: {(loaded - start) * 1000} ms")
    print(f"creating a mask: {(masked - loaded) * 1000} ms")
    print(f"averaging the array: {(averaged - masked) * 1000} ms")
    # Return the averages of each column
    return dict(zip(COLUMN_NAMES[1:], averages))


if __name__ == '__main__':
    import sys
    import time

    start = time.perf_counter()
    averages = run()
    end = time.perf_counter()

    CORRECT_HUMIDITY = 80.8129
    CORRECT_SALINITY = 36.1433
    CORRECT_AIR_TEMPERATURE = 19.7976
    CORRECT_WIND_TEMPERATURE = 34.1683
    CORRECT_WIND_SPEED = 5.6777

    ANSWERS = {
        'humidity': CORRECT_HUMIDITY,
        'salinity': CORRECT_SALINITY,
        'air_temperature': CORRECT_AIR_TEMPERATURE,
        'water_temperature':CORRECT_WIND_TEMPERATURE,
        'wind_speed': CORRECT_WIND_SPEED,
    }

    for column, value in ANSWERS.items():
        assert math.isclose(
            averages[column],
            value,
            rel_tol=1e-5,
        ), f"{column} should be {value}, instead {averages[column]}"

    print("Succesfully validated the data using {} in {} seconds".format(__file__, end - start))

    sys.exit(0)
