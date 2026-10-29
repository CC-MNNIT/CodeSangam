-- Every team below is a synthetic test fixture, not an actual registration.
INSERT INTO `user` (uid, registration_no, name, email, avatar) VALUES
  (1, '20244001', 'Demo Team Leader', 'leader@example.test', '/api/static/img/favicon.svg'),
  (2, '20244002', 'Demo Team Member', 'member@example.test', '/api/static/img/favicon.svg'),
  (3, '20244003', 'Other Team Leader', 'other@example.test', '/api/static/img/favicon.svg'),
  (4, '20234004', 'Demo Mentor', 'mentor@example.test', '/api/static/img/favicon.svg'),
  (5, '20238024', 'Shanu (staging only)', 'shanu.20238024@mnnit.ac.in', '/api/static/img/favicon.svg'),
  (6, '20210001', 'Unallotted Viewer', 'viewer@example.test', '/api/static/img/favicon.svg'),
  (7, '20244007', 'Logical Only Leader', 'logical@example.test', '/api/static/img/favicon.svg');
INSERT INTO team (id, name, leader_id, m_id1, m_id2) VALUES
  (101, 'Demo Shared Name', 1, 2, 5),
  (102, '=HYPERLINK("https://example.test")', 3, 0, 0),
  (201, 'Demo Shared Name', 2, 0, 0),
  (301, 'Demo Logical Team', 3, 0, 0),
  (302, 'Logical Only Team', 7, 0, 0),
  (401, 'Demo Software Team', 2, 0, 0);
INSERT INTO webster (team_id, score) VALUES (101, 50), (102, 0);
INSERT INTO droidrush (team_id, score) VALUES (201, 50);
INSERT INTO logical (team_id, score) VALUES (301, 0), (302, 0);
INSERT INTO softablitz (team_id, score) VALUES (401, 0);
INSERT INTO mentor (registration_no, email, phone, events) VALUES ('20234004', 'mentor@example.test', '', 'webster;droidrush');
INSERT INTO allotment (team_id, user_id) VALUES (101, 4);
