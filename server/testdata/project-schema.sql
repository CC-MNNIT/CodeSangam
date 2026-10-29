-- Synthetic QA schema only. Never run against the production database.
CREATE TABLE IF NOT EXISTS `user` (
  uid INT PRIMARY KEY AUTO_INCREMENT,
  registration_no VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  avatar VARCHAR(255)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS team (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  leader_id INT,
  m_id1 INT DEFAULT 0,
  m_id2 INT DEFAULT 0
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS webster (team_id INT PRIMARY KEY, score INT DEFAULT 0) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS droidrush (team_id INT PRIMARY KEY, score INT DEFAULT 0) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS softablitz (team_id INT PRIMARY KEY, score INT DEFAULT 0) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS logical (team_id INT PRIMARY KEY, score INT DEFAULT 0) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS mentor (
  registration_no VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(255),
  events VARCHAR(255)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS allotment (team_id INT, user_id INT, PRIMARY KEY (team_id, user_id)) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS abstract (team_id INT PRIMARY KEY) ENGINE=InnoDB;
