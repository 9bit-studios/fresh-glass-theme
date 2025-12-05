#!/usr/bin/env python3
import csv

input_file = 'product_template_corrected.csv'
output_file = 'product_template_final.csv'

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', encoding='utf-8', newline='') as outfile:

    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Write header as-is
    header = next(reader)
    writer.writerow(header)

    # Find the column index for "Variant Fulfillment Service"
    fulfillment_col = header.index('Variant Fulfillment Service')

    # Process each row
    for row in reader:
        # Replace fulfillment service value with 'manual'
        if len(row) > fulfillment_col:
            row[fulfillment_col] = 'manual'
        writer.writerow(row)

print(f"✅ Fixed CSV saved to {output_file}")
print(f"   Changed column {fulfillment_col} (Variant Fulfillment Service) to 'manual'")
