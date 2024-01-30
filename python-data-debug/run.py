import csv
import math
import statistics

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

def average_column(column):
    return { 'avg': sum(column) / len(column) }

def analyze(path, usecols=None, names=None, analyze_column=average_column):

    # Load columns from a local CSV file into a list
    data = None
    with open(path) as csvdata:
        csv_reader = csv.reader(csvdata)
        for row in csv_reader:
            # initialize the list of list
            if not data:
                data = [[] for _ in range(len(usecols if usecols else row))]
            for i in range(len(usecols if usecols else row)):
                # parse the numerical values and store in a list for each column
                data[i].append(float(row[usecols[i]]))

    # get rid of NaNs
    def is_not_nan(x):
        return not math.isnan(x)

    data_without_nans = map(
        lambda column: list(filter(is_not_nan, column)),
        data
    )

    # Calculate the metrics for each column
    metrics = list(map(analyze_column, data_without_nans))

    # Return the metrics in a dictionary
    column_keys = next(filter(
        lambda val: val is not None,
        [names, usecols, range(len(metrics))]
    ))
    return dict(zip(column_keys, metrics))


if __name__ == '__main__':
    import sys
    import time
    import argparse

    # Set up argument parsing
    parser = argparse.ArgumentParser(
        prog='Data analyzer',
        description='Calculates averages of each column in a given csv table'
    )
    parser.add_argument('-f', '--filename', help='Path to the csv file', default=DATA_PATH)
    parser.add_argument('-p', '--no-perf', help='Do not print the elapsed time', default=False, action='store_true')
    parser.add_argument('-c', '--cols', help='List of column numbers to include (starting from 0); All are used by default')
    parser.add_argument('-n', '--names', help='List of the column names; Optional')
    
    args = parser.parse_args()
    columns = list(map(lambda i: int(i), args.cols.split(','))) if args.cols or not args.filename == DATA_PATH else range(1, len(COLUMN_NAMES))
    names = args.names if args.names or not args.filename == DATA_PATH else list(map(lambda col: COLUMN_NAMES[col], columns))

    def analyze_column(column):
        return {
            'avg': sum(column) / len(column),
            'med': statistics.median(column)
        }
    start = time.perf_counter()
    metrics = analyze(args.filename, usecols=columns, names=names, analyze_column=analyze_column)
    end = time.perf_counter()

    # Pretty print the calculated metrics for each column
    print("Results")
    METRIC_WIDTH = 10
    max_name = max(map(lambda s: len(s), metrics.keys())) + 1 # longest name + colon
    print(f"  {'Name':<{max_name}}", end='')
    for metric_name in next(iter(metrics.values())).keys():
        print(f" {metric_name:>{METRIC_WIDTH}}", end='')
    print()
    for column, column_metrics in metrics.items():
        print(f"  {column + ':':<{max_name}}", end='')
        for metric in column_metrics.values():
            print(f" {metric:>{METRIC_WIDTH}.05f}", end='')
        print()

    # assert correctness in case of the default execution without any parameters
    if args.filename == DATA_PATH and not args.cols:
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
                metrics[column]['avg'],
                value,
                rel_tol=1e-5,
            ), f"{column} should be {value}, instead {metrics[column]}"

        print(f"Succesfully validated the data using {__file__} in {end - start} seconds")
    
    elif not args.no_perf:
        print(f"Elapsed time: {end - start} seconds")

    sys.exit(0)
