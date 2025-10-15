package com.habla.dayaway.repository;

import com.habla.dayaway.model.VacationResolution;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class VacationResolutionRepository {

    private final JdbcTemplate jdbcTemplate;

    public VacationResolutionRepository(JdbcTemplate jdbcTemplate){
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
}
