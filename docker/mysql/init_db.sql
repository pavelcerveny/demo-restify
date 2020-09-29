CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1600889052205, 'Users1600889052205'),
(2, 1600889222592, 'MonitoredEndpoints1600889222592'),
(3, 1600889292774, 'MonitoringResults1600889292774');

CREATE TABLE `monitored_endpoints` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_check` datetime DEFAULT NULL,
  `monitored_interval` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `monitoring_results` (
  `id` int(11) NOT NULL,
  `checked_at` datetime NOT NULL,
  `status_code` int(11) NOT NULL,
  `payload` mediumtext NOT NULL,
  `monitored_endpoint_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `email`, `access_token`) VALUES
(1, 'Applifting', 'info@applifting.cz', '93f39e2f-80de-4033-99ee-249d92736a25'),
(2, 'Batman', 'batman@example.com', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e');

ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `monitored_endpoints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d6b8b7e91a0ef3ea22e0d92749e` (`user_id`);

ALTER TABLE `monitoring_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_09d270e07b15647396573fbab8e` (`monitored_endpoint_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `monitored_endpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `monitoring_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
ALTER TABLE `monitored_endpoints`
  ADD CONSTRAINT `FK_d6b8b7e91a0ef3ea22e0d92749e` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `monitoring_results`
  ADD CONSTRAINT `FK_09d270e07b15647396573fbab8e` FOREIGN KEY (`monitored_endpoint_id`) REFERENCES `monitored_endpoints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
