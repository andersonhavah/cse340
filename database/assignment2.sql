-- Query 1: Insert Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: Modify Tony Stark's account_type to Admin
-- Assuming account_email is a unique identifier for Tony Stark,
-- or you would have previously fetched his account_id.
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Query 3: Delete Tony Stark record
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Query 4: Modify GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Select Sport category vehicles
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Query 6: Update inventory image and thumbnail paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');