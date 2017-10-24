#!/usr/bin/env python

from setuptools import setup, find_packages

PACKAGE = 'workout'
VERSION = '0.1'

setup(
    name = PACKAGE,
    version = VERSION,
    package_dir = {'': 'src'},
    packages = find_packages('src', exclude=['workout.tests',
                                             'workout.tests.*']),
    install_requires = [ "click"],
    entry_points = {"console_scripts":
                    ['workout = workout.workout:main']},
    test_suite = "workout.tests",
)
