package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    // Shared
    private Map<String, Object> counters;
    private List<Map<String, Object>> trends; // For charts
    private List<Map<String, Object>> recentActivities; // For widgets
}
