#!/usr/bin/python3

import click
import json
import pprint
import random
import time
import sys
from AppKit import NSBeep

def load_config(ctx, param, value):
    return json.load(value)

def convert_duration(ctr, param, value):
    try:
        return int(value)*60
    except:
        print "This is not an integer '%s'" % value
        sys.exit()

def get_workout(config, rand, cur):
    if rand:
        return random.choice(config["workouts"])
    else:
        return config["workouts"][cur % len(config["workouts"])]

def run_timer(duration):
    dur = duration
    while dur >= 0:

        timeformat="\r%d Seconds left" % dur
        sys.stdout.write(timeformat)
        sys.stdout.flush()
        time.sleep(1)
        dur -= 1
    print "Done"
    NSBeep()

@click.command()
@click.option("--config", type=click.File("rb"), callback=load_config)
@click.option("--duration", default=int(15), help="Number of minutes to work out",
              callback=convert_duration)
@click.option("--random", is_flag=True, default=False)
def main(config, duration, random):
    time = 0
    rest = config
    print "Starting workout for %d Minutes" % (duration/60)
    cur = 0
    first = True
    while time < duration:
        if not first:
            print "\nRest"
            run_timer(config["rest_duration"])
        else:
            first = False
        workout = get_workout(config, random, cur)
        sys.stdout.write('\a')
        print "\nDo %s" % workout["name"]
        cur += 1
        run_timer(workout["duration"])

        time += workout["duration"] + config["rest_duration"]




if __name__ == '__main__':
    main()
