import csv
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

    # Load columns from a local CSV file into a list
    data = [[] for _ in range(len(COLUMN_NAMES) - SKIP_COLS)]
    with open(DATA_PATH) as csvdata:
        csv_reader = csv.reader(csvdata)
        for row in csv_reader:
            for col_i in range(len(data)):
                # parse the numerical values
                data[col_i].append(float(row[col_i + SKIP_COLS]))

    def is_not_nan(x):
        return not math.isnan(x)

    # get rid of NaNs
    data_without_nans = map(
        lambda column: list(filter(is_not_nan, column)),
        data
    )

    # Calculate the average of each column
    averages = list(
        map(lambda col: sum(col) / len(col), data_without_nans)
    )

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
