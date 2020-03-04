#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"
git subtree push --prefix api heroku master && heroku logs --tail

