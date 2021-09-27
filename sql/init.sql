CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ms_auth_user(
    uuid uuid DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (uuid) 
);

INSERT INTO ms_auth_user (username, email, password) VALUES ('admin', 'admin@admin.com.br', crypt('admin', 'my_salt'));