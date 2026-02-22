#!/bin/bash

# Invert all dark themes to create their light variants

cd "$(dirname "$0")/themes" || exit 1

for dark_theme in *-theme.json; do
  # Skip if it already has "-light" in the name
  if [[ "$dark_theme" == *"-light"* ]]; then
    continue
  fi
  
  # Generate the light theme filename
  light_theme="${dark_theme%-theme.json}-light-theme.json"
  
  echo "Inverting $dark_theme -> $light_theme"
  npx tsx ../theme-inverter.ts "$dark_theme" "$light_theme"
done

echo "Done!"
