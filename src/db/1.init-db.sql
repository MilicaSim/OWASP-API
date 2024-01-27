CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- create table USER
CREATE TABLE "user"(
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL,
	password_hash TEXT NOT NULL,
	created_on TIMESTAMPTZ DEFAULT NOW(),
	updated_on TIMESTAMPTZ,
	is_active BOOLEAN DEFAULT true,
	storage_space int NOT NULL DEFAULT 500, -- allowed storage space in MB
	used_space int NOT NULL DEFAULT 0, -- used space in bytes
	PRIMARY KEY(id)
);

-- create table USER_ROLE
CREATE TABLE "user_role"(
	id int2 NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	permission_mask bit(32) DEFAULT (0)::bit(32) NOT NULL,
	PRIMARY KEY(id)
);

-- insert into USER_ROLE
INSERT INTO "public"."user_role"("id", "name", "permission_mask", "description") VALUES (1, 'Admin', '11111111111111111111111111111111', 'Global admin');
INSERT INTO "public"."user_role"("id", "name", "permission_mask", "description") VALUES (2, 'Product admin', '00000000000000000000000000000010', 'Product admin');
INSERT INTO "public"."user_role"("id", "name", "permission_mask", "description") VALUES (5, 'User', '00000000000000000000000000000000', 'Regular user');

ALTER TABLE "user"
ADD COLUMN role_id int2,
ADD FOREIGN KEY(role_id) REFERENCES "user_role"(id);

-- make role_id mandatory
ALTER TABLE "user"
ALTER COLUMN role_id SET NOT NULL; 

-- insert into USER
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('3202014f-4e5b-4290-af4b-c665f2d94767', 'System', 'Admin', 'sadmin@gmail.com', 'password', '', 1);
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('42796532-83c8-4292-b9a4-27de16b1fcba', 'Product', 'Admin', 'padmin@gmail.com', 'password', '', 2);
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('0ba82e03-af4a-49cb-8774-f837e977327f', 'User1', 'Regular', 'user1@gmail.com', 'password', '', 5);
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('3e02162e-3f4b-4719-a655-f6b3ae6ed070', 'User2', 'Regular', 'user2@gmail.com', 'password', '', 5);
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('331cbde4-66c6-41a6-8825-3a47d36f3828', 'User3', 'Regular', 'user3@gmail.com', 'password', '', 5);
INSERT INTO "user" (id, first_name, last_name, email, password, password_hash, role_id) VALUES ('49fb0b3f-f25d-4540-b84c-f366a8b0cc9e', 'User4', 'Regular', 'user4@gmail.com', 'password', '', 5);

-- -- create table AUTH_TOKEN
-- CREATE TABLE "auth_token"(
-- 	id uuid NOT NULL DEFAULT uuid_generate_v4(),
-- 	user_id uuid NOT NULL,
-- 	token TEXT NOT NULL,
-- 	exp_date TIMESTAMPTZ DEFAULT NOW() + '1 hour'::interval,
-- 	issued_on TIMESTAMPTZ DEFAULT NOW(),
-- 	PRIMARY KEY(id),
-- 	FOREIGN KEY(user_id) REFERENCES "user"(id)
-- );

-- create table CARD
CREATE TABLE "card"(
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	id_number SERIAL,
	name TEXT NOT NULL,
	created_by_id uuid NOT NULL,
	cvc int2 NOT NULL,
	number TEXT NOT NULL,
	exp_date TIMESTAMPTZ NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_on TIMESTAMPTZ DEFAULT NOW(),
	updated_on TIMESTAMPTZ,
	is_deleted boolean DEFAULT false,
	PRIMARY KEY(id),
	FOREIGN KEY(created_by_id) REFERENCES "user"(id)
);

-- create table PRODUCT
CREATE TABLE "product"(
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	id_number SERIAL,
	created_by_id uuid NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	image TEXT NOT NULL,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	price int NOT NULL,
	created_on TIMESTAMPTZ DEFAULT NOW(),
	updated_on TIMESTAMPTZ,
	PRIMARY KEY(id),
	FOREIGN KEY(created_by_id) REFERENCES "user"(id)
);

INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('36ccc8c3-60e8-4082-8f1c-5e1931b0f401', 1, '0ba82e03-af4a-49cb-8774-f837e977327f', 'image', 'Sled', 'description', 15);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('6bb63e62-8d3a-4227-8351-a9dddfae5139', 2, '3e02162e-3f4b-4719-a655-f6b3ae6ed070', 'image', 'Christmas tree', 'description', 20);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('3cea5c9c-71c0-4da2-980c-2aa3cc7b2a3c', 3, '331cbde4-66c6-41a6-8825-3a47d36f3828', 'image', 'Bike', 'description', 35);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('e7288edb-8c03-4974-bf4e-82f304f652b4', 4, '49fb0b3f-f25d-4540-b84c-f366a8b0cc9e', 'image', 'Vases', 'description', 9);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('85d5a8bc-19b3-41ca-a84c-d898ca8d5a1b', 5, '49fb0b3f-f25d-4540-b84c-f366a8b0cc9e', 'image', 'Glasses', 'description', 20);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('06156f76-b9ec-4c1b-b587-dbff91b67771', 6, '3e02162e-3f4b-4719-a655-f6b3ae6ed070', 'image', 'Mobile', 'description', 40);
INSERT INTO "product" (id, id_number, created_by_id, image, name, description, price) VALUES ('f7e74834-cf96-4ca0-a7fb-538f4f62529f', 7, '331cbde4-66c6-41a6-8825-3a47d36f3828', 'image', 'Lamp', 'description', 25);

-- db functions
CREATE OR REPLACE FUNCTION "get_user_allowed_card_ids"(userId uuid)
	RETURNS TABLE("id" int4) AS $BODY$

	SELECT id_number
	FROM card
	WHERE is_deleted = false
	AND created_by_id = userId;

$BODY$
LANGUAGE sql VOLATILE;


CREATE OR REPLACE FUNCTION "get_storage_space_info"(userId uuid)
	RETURNS TABLE("used_space" bigint, "allowed_space" bigint) AS $BODY$

	SELECT u.used_space -- in bytes
		, u.storage_space::BIGINT * 1024 * 1024 AS allowed_space -- convert from MB to bytes
	FROM "user" u
	WHERE u.id = userId;

$BODY$
LANGUAGE sql VOLATILE;
