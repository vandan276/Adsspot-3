#!/bin/bash
# Standalone Mac Desktop Launcher for Adsspot

if [ -d "/Applications/Google Chrome.app" ]; then
    open -na "Google Chrome" --args --app="http://localhost:3000" --user-data-dir="$HOME/Library/Application Support/AdsspotApp"
elif [ -d "/Applications/Brave Browser.app" ]; then
    open -na "Brave Browser" --args --app="http://localhost:3000"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    open -na "Microsoft Edge" --args --app="http://localhost:3000"
else
    open "http://localhost:3000"
fi
