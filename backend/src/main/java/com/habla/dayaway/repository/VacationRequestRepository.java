package com.habla.dayaway.repository;

import com.habla.dayaway.model.VacationRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class VacationRequestRepository {

    private final JdbcTemplate jdbcTemplate;

    public VacationRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // RowMapper: Converts each DB row into a VacationRequest object
    private final RowMapper<VacationRequest> vacationRequestRowMapper = new RowMapper<>() {
        @Override
        public VacationRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
            return VacationRequest.builder()
                    .id(rs.getLong("id"))
                    .employeeName(rs.getString("employee_name"))
                    .firstDay(rs.getDate("first_day").toLocalDate())
                    .lastDay(rs.getDate("last_day").toLocalDate())
                    .note(rs.getString("note"))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .build();
        }
    };

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM vacation_requests WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    public List<VacationRequest> findAll() {
        String sql = "SELECT * FROM vacation_requests ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, vacationRequestRowMapper);
    }

    public Optional<VacationRequest> findById(Long id) {
        String sql = "SELECT * FROM vacation_requests WHERE id = ?";
        List<VacationRequest> result = jdbcTemplate.query(sql, vacationRequestRowMapper, id);
        return result.stream().findFirst();
    }

    public int save(VacationRequest request) {
        String sql = """
            INSERT INTO vacation_requests (employee_name, first_day, last_day, note)
            VALUES (?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                request.getEmployeeName(),
                request.getFirstDay(),
                request.getLastDay(),
                request.getNote());
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM vacation_requests WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public List<VacationRequest> findByEmployeeName(String employeeName) {
        String sql = "SELECT * FROM vacation_requests WHERE employee_name = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, vacationRequestRowMapper, employeeName);
    }
}
