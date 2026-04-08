CREATE TABLE zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0
);

CREATE TABLE gates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    zone_id BIGINT,
    wait_time_minutes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN',
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    qr_hash VARCHAR(255) NOT NULL UNIQUE,
    gate_id BIGINT,
    status VARCHAR(50) DEFAULT 'VALID',
    FOREIGN KEY (gate_id) REFERENCES gates(id)
);
