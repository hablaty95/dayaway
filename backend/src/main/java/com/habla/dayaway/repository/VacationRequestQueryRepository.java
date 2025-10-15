package com.habla.dayaway.repository;

import com.habla.dayaway.dto.VacationRequestWithResolutionDto;
import com.habla.dayaway.model.VacationResolution;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class VacationRequestQueryRepository {

    private final JdbcTemplate jdbcTemplate;

    public VacationRequestQueryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<VacationRequestWithResolutionDto> rowMapper = new RowMapper<>() {
        @Override
        public VacationRequestWithResolutionDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            VacationResolution resolution = null;
            if (rs.getObject("res_id") != null) {
                resolution = VacationResolution.builder()
                        .id(rs.getLong("res_id"))
                        .vacationRequestId(rs.getLong("req_id"))
                        .decision(rs.getBoolean("decision"))
                        .resolverName(rs.getString("resolver_name"))
                        .note(rs.getString("res_note"))
                        .createdAt(rs.getTimestamp("res_created_at").toLocalDateTime())
                        .build();
            }

            return VacationRequestWithResolutionDto.builder()
                    .id(rs.getLong("req_id"))
                    .employeeName(rs.getString("employee_name"))
                    .firstDay(rs.getDate("first_day").toLocalDate())
                    .lastDay(rs.getDate("last_day").toLocalDate())
                    .note(rs.getString("req_note"))
                    .createdAt(rs.getTimestamp("req_created_at").toLocalDateTime())
                    .resolution(resolution)
                    .build();
        }
    };

    public List<VacationRequestWithResolutionDto> findAllWithResolutions() {
        String sql = """
            SELECT 
                vr.id AS req_id,
                vr.employee_name,
                vr.first_day,
                vr.last_day,
                vr.note AS req_note,
                vr.created_at AS req_created_at,
                r.id AS res_id,
                r.decision,
                r.resolver_name,
                r.note AS res_note,
                r.created_at AS res_created_at
            FROM vacation_requests vr
            LEFT JOIN vacation_resolutions r
            ON vr.id = r.vacation_request_id
            ORDER BY vr.created_at DESC
        """;

        return jdbcTemplate.query(sql, rowMapper);
    }
}
