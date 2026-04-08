INSERT INTO zones (name, capacity, current_occupancy) VALUES ('North Stand', 20000, 5000);
INSERT INTO zones (name, capacity, current_occupancy) VALUES ('South Stand', 20000, 3000);
INSERT INTO zones (name, capacity, current_occupancy) VALUES ('VIP Lounge', 1000, 200);

INSERT INTO gates (name, zone_id, wait_time_minutes, status) VALUES ('Gate A', 1, 5, 'OPEN');
INSERT INTO gates (name, zone_id, wait_time_minutes, status) VALUES ('Gate B', 1, 12, 'OPEN');
INSERT INTO gates (name, zone_id, wait_time_minutes, status) VALUES ('Gate C', 2, 2, 'OPEN');
INSERT INTO gates (name, zone_id, wait_time_minutes, status) VALUES ('Gate VIP', 3, 0, 'OPEN');

INSERT INTO tickets (qr_hash, gate_id, status) VALUES ('dummy-qr-hash-1', 1, 'VALID');
INSERT INTO tickets (qr_hash, gate_id, status) VALUES ('dummy-qr-hash-2', 2, 'VALID');
