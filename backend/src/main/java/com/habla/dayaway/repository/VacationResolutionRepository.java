package com.habla.dayaway.repository;

import com.habla.dayaway.model.VacationResolution;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.Optional;

@Repository
public class VacationResolutionRepository {

    private final JdbcTemplate jdbcTemplate;

    public VacationResolutionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<VacationResolution> vacationResolutionRowMapper = new RowMapper<VacationResolution>() {
        @Override
        public VacationResolution mapRow(ResultSet rs, int rowNum) throws SQLException {
            return VacationResolution.builder()
                    .id(rs.getLong("id"))
                    .vacationRequestId(rs.getLong("vacation_request_id"))
                    .decision(rs.getBoolean("decision"))
                    .resolverName(rs.getString("resolver_name"))
                    .note(rs.getString("note"))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .build();
        }
    };

    public VacationResolution save(VacationResolution resolution) {
        String sql = """
        INSERT INTO vacation_resolutions
        (vacation_request_id, decision, resolver_name, note, created_at)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id
    """;

        // queryForObject returns the generated id directly
        Long id = jdbcTemplate.queryForObject(
                sql,
                Long.class,
                resolution.getVacationRequestId(),
                resolution.getDecision(),
                resolution.getResolverName(),
                resolution.getNote(),
                Timestamp.valueOf(resolution.getCreatedAt())
        );

        resolution.setId(id);
        return resolution;
    }


    public Optional<VacationResolution> findByVacationRequestId(Long requestId) {
        String sql = "SELECT * FROM vacation_resolutions WHERE vacation_request_id = ?";
        return jdbcTemplate.query(sql, vacationResolutionRowMapper, requestId)
                .stream()
                .findFirst();
    }

    public boolean existsByVacationRequestId(Long requestId) {
        String sql = "SELECT COUNT(*) FROM vacation_resolutions WHERE vacation_request_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, requestId);
        return count != null && count > 0;
    }
}
