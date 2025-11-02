// ============================================
// ANALYTICS DASHBOARD - JAVASCRIPT
// ============================================

// ============================================
// THEME MANAGEMENT
// ============================================

// Apply theme from localStorage (sync with dashboard)
function applyThemeFromDashboard() {
  const savedTheme = localStorage.getItem('automatter_theme');
  console.log('📊 Analytics: Applying theme from localStorage:', savedTheme);

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  const newTheme = isDark ? 'dark' : 'light';

  localStorage.setItem('automatter_theme', newTheme);
  console.log('📊 Analytics: Theme toggled to:', newTheme);

  // Update charts if they exist
  if (window.engagementChart) {
    updateChartsForTheme();
  }
}

// Update chart colors based on theme
function updateChartsForTheme() {
  const isDark = document.body.classList.contains('dark-mode');
  const textColor = isDark ? '#f3f4f6' : '#1f2937';
  const gridColor = isDark ? '#374151' : '#e2e8f0';

  const charts = [window.engagementChart, window.platformChart, window.sentimentChart];

  charts.forEach(chart => {
    if (chart && chart.options) {
      // Update scales
      if (chart.options.scales) {
        Object.values(chart.options.scales).forEach(scale => {
          if (scale.ticks) scale.ticks.color = textColor;
          if (scale.grid) scale.grid.color = gridColor;
        });
      }

      // Update legend
      if (chart.options.plugins && chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }

      chart.update();
    }
  });
}

// Apply theme immediately (before DOMContentLoaded)
applyThemeFromDashboard();

// Listen for theme changes from other pages
window.addEventListener('storage', (e) => {
  if (e.key === 'automatter_theme') {
    console.log('📊 Analytics: Storage event detected, new theme:', e.newValue);
    applyThemeFromDashboard();
  }
});

// Listen for page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('📊 Analytics: Page became visible, syncing theme');
    applyThemeFromDashboard();
  }
});

// Listen for page show (back/forward navigation)
window.addEventListener('pageshow', (event) => {
  console.log('📊 Analytics: Page show event, syncing theme');
  applyThemeFromDashboard();
});

// Listen for focus
window.addEventListener('focus', () => {
  console.log('📊 Analytics: Window focused, syncing theme');
  applyThemeFromDashboard();
});

// ============================================
// SAMPLE DATA
// ============================================

const analyticsData = {
  totalReach: 145678,
  engagementRate: 8.4,
  followersGrowth: 2345,

  engagementOverTime: {
    labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
    data: [4200, 5100, 4800, 6200, 7100, 6800, 8400]
  },

  platformComparison: {
    labels: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube'],
    data: [45000, 32000, 28000, 25000, 15678],
    colors: ['#E1306C', '#1877F2', '#0A66C2', '#000000', '#FF0000']
  },

  sentimentDistribution: {
    labels: ['Positive', 'Neutral', 'Negative'],
    data: [78, 18, 4],
    colors: ['#4CAF50', '#FF9800', '#F44336']
  },

  heatmapData: generateHeatmapData()
};

// ============================================
// ANIMATED COUNTERS
// ============================================

function animateCounter(element, target, suffix = '') {
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    if (suffix === '%') {
      element.textContent = current.toFixed(1) + suffix;
    } else {
      element.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 16);
}

// Initialize counters
document.addEventListener('DOMContentLoaded', () => {
  // Apply theme again after DOM loads
  applyThemeFromDashboard();

  // Initialize theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('📊 Analytics: Theme toggle button initialized');
  }

  // Initialize counters
  animateCounter(document.getElementById('totalReach'), analyticsData.totalReach);
  animateCounter(document.getElementById('engagementRate'), analyticsData.engagementRate, '%');
  animateCounter(document.getElementById('followersGrowth'), analyticsData.followersGrowth, '+');
});

// ============================================
// ENGAGEMENT OVER TIME CHART (LINE)
// ============================================

const engagementCtx = document.getElementById('engagementChart').getContext('2d');
const engagementChart = new Chart(engagementCtx, {
  type: 'line',
  data: {
    labels: analyticsData.engagementOverTime.labels,
    datasets: [{
      label: 'Engagement',
      data: analyticsData.engagementOverTime.data,
      borderColor: '#FF4081',
      backgroundColor: 'rgba(255, 64, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#FF4081',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#212121',
        bodyColor: '#757575',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'Engagement: ' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F0F0F0',
          drawBorder: false
        },
        ticks: {
          color: '#757575',
          font: {
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#757575',
          font: {
            size: 12
          }
        }
      }
    }
  }
});

// ============================================
// PLATFORM COMPARISON CHART (BAR)
// ============================================

const platformCtx = document.getElementById('platformChart').getContext('2d');
const platformChart = new Chart(platformCtx, {
  type: 'bar',
  data: {
    labels: analyticsData.platformComparison.labels,
    datasets: [{
      label: 'Reach',
      data: analyticsData.platformComparison.data,
      backgroundColor: [
        'rgba(225, 48, 108, 0.8)',
        'rgba(24, 119, 242, 0.8)',
        'rgba(10, 102, 194, 0.8)',
        'rgba(0, 0, 0, 0.8)',
        'rgba(255, 0, 0, 0.8)'
      ],
      borderColor: [
        '#E1306C',
        '#1877F2',
        '#0A66C2',
        '#000000',
        '#FF0000'
      ],
      borderWidth: 2,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#212121',
        bodyColor: '#757575',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'Reach: ' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F0F0F0',
          drawBorder: false
        },
        ticks: {
          color: '#757575',
          font: {
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#757575',
          font: {
            size: 12
          }
        }
      }
    }
  }
});

// ============================================
// SENTIMENT DISTRIBUTION CHART (DONUT)
// ============================================

const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
const sentimentChart = new Chart(sentimentCtx, {
  type: 'doughnut',
  data: {
    labels: analyticsData.sentimentDistribution.labels,
    datasets: [{
      data: analyticsData.sentimentDistribution.data,
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ],
      borderColor: [
        '#4CAF50',
        '#FF9800',
        '#F44336'
      ],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 13
          },
          color: '#757575',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#212121',
        bodyColor: '#757575',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  }
});

// ============================================
// HEATMAP GENERATION
// ============================================

function generateHeatmapData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate higher engagement during business hours and evenings
      let value = Math.random() * 30;
      if (hour >= 9 && hour <= 17) value += 40; // Business hours
      if (hour >= 18 && hour <= 22) value += 50; // Evening peak
      if (day >= 5) value *= 0.7; // Lower on weekends

      data.push({
        day: days[day],
        hour: hour,
        value: Math.min(100, value)
      });
    }
  }

  return data;
}

function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Add hour labels
  container.innerHTML = '<div class="heatmap-label"></div>';
  for (let hour = 0; hour < 24; hour++) {
    const hourLabel = document.createElement('div');
    hourLabel.className = 'heatmap-hour';
    hourLabel.textContent = hour;
    container.appendChild(hourLabel);
  }

  // Add day rows
  days.forEach((day, dayIndex) => {
    const dayLabel = document.createElement('div');
    dayLabel.className = 'heatmap-label';
    dayLabel.textContent = day;
    container.appendChild(dayLabel);

    for (let hour = 0; hour < 24; hour++) {
      const cellData = analyticsData.heatmapData.find(
        d => d.day === day && d.hour === hour
      );

      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const intensity = cellData.value / 100;
      cell.style.backgroundColor = `rgba(255, 64, 129, ${intensity})`;
      cell.title = `${day} ${hour}:00 - Engagement: ${Math.round(cellData.value)}%`;
      container.appendChild(cell);
    }
  });
}

// Initialize heatmap
document.addEventListener('DOMContentLoaded', renderHeatmap);

// ============================================
// PLATFORM SWITCHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const platformButtons = document.querySelectorAll('.platform-btn');

  platformButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      platformButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Get platform
      const platform = button.dataset.platform;
      console.log(`📊 Analytics: Switched to ${platform} analytics`);

      // Update charts with platform-specific data (simulated)
      if (platform !== 'all') {
        updateChartsForPlatform(platform);
      }

      // Add smooth transition effect
      document.querySelectorAll('.chart-card').forEach(card => {
        card.style.opacity = '0.5';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 300);
      });
    });
  });
});

function updateChartsForPlatform(platform) {
  // Simulate platform-specific data changes
  const multiplier = {
    instagram: 1.2,
    facebook: 0.9,
    linkedin: 0.8,
    twitter: 1.0,
    youtube: 0.7
  }[platform] || 1.0;

  // Update engagement chart
  const newData = analyticsData.engagementOverTime.data.map(val =>
    Math.round(val * multiplier)
  );
  engagementChart.data.datasets[0].data = newData;
  engagementChart.update('active');

  // Update counters
  const newReach = Math.round(analyticsData.totalReach * multiplier);
  const newEngagement = (analyticsData.engagementRate * multiplier).toFixed(1);
  const newGrowth = Math.round(analyticsData.followersGrowth * multiplier);

  animateCounter(document.getElementById('totalReach'), newReach);
  animateCounter(document.getElementById('engagementRate'), parseFloat(newEngagement), '%');
  animateCounter(document.getElementById('followersGrowth'), newGrowth, '+');
}

// ============================================
// TIME RANGE SELECTOR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const timeRangeSelector = document.getElementById('timeRange');

  timeRangeSelector.addEventListener('change', (e) => {
    const days = parseInt(e.target.value);
    updateEngagementChartRange(days);
  });
});

function updateEngagementChartRange(days) {
  let labels, data;

  if (days === 7) {
    labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    data = [4200, 5100, 4800, 6200, 7100, 6800, 8400];
  } else if (days === 30) {
    labels = ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'];
    data = [4200, 5100, 4800, 6200, 7100, 6800, 8400];
  } else if (days === 90) {
    labels = ['Week 1', 'Week 4', 'Week 7', 'Week 10', 'Week 13'];
    data = [3800, 5200, 6100, 7400, 8400];
  }

  engagementChart.data.labels = labels;
  engagementChart.data.datasets[0].data = data;
  engagementChart.update('active');
}

// ============================================
// SMOOTH TRANSITIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Add smooth fade-in for all cards
  const cards = document.querySelectorAll('.stat-card, .chart-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

// ============================================
// RESPONSIVE CHART RESIZE
// ============================================

window.addEventListener('resize', () => {
  engagementChart.resize();
  platformChart.resize();
  sentimentChart.resize();
});

// ============================================
// CONSOLE LOG FOR DEBUGGING
// ============================================

console.log('📊 Analytics Dashboard Loaded Successfully!');
console.log('Total Reach:', analyticsData.totalReach.toLocaleString());
console.log('Engagement Rate:', analyticsData.engagementRate + '%');
console.log('Followers Growth:', '+' + analyticsData.followersGrowth.toLocaleString());

