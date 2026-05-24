(function(){
  const C = window.__SCHOOL_CONFIG__ || {};

  /* ====== PARENT DATA POPULATION ====== */
  const hw = C.homework || [];
  const cw = C.classwork || [];
  const fees = C.fees || [];
  const notices = C.notices || [];
  const absences = C.absences || [];

  function renderCards(containerId, items, renderer) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map(renderer).join('');
  }

  // Homework
  renderCards('homework-list', hw, h => `
    <div class="card-item">
      <div class="card-icon" style="background:${h.color || '#EEF2FF'};color:${h.textColor || '#6366F1'}">${h.icon || '📝'}</div>
      <div class="card-content"><div class="card-title">${h.subject}: ${h.title}</div><div class="card-sub">${h.due || 'Tomorrow'}</div></div>
      <div class="card-badge" style="background:${h.status === 'Done' ? '#DCFCE7' : '#FEF3C7'};color:${h.status === 'Done' ? '#16A34A' : '#D97706'}">${h.status || 'Pending'}</div>
    </div>`);

  // Classwork
  renderCards('classwork-list', cw, c => `
    <div class="card-item">
      <div class="card-icon" style="background:${c.color || '#F0FDF4'};color:${c.textColor || '#16A34A'}">${c.icon || '📖'}</div>
      <div class="card-content"><div class="card-title">${c.subject}: ${c.title}</div><div class="card-sub">${c.date || 'Today'}</div></div>
    </div>`);

  // Fees
  renderCards('fees-list', fees, f => `
    <div class="card-item">
      <div class="card-icon" style="background:${f.paid ? '#DCFCE7' : '#FEE2E2'};color:${f.paid ? '#16A34A' : '#DC2626'}">${f.paid ? '✓' : '!'}</div>
      <div class="card-content"><div class="card-title">${f.name}</div><div class="card-sub">${f.paid ? 'Paid on ' + f.date : 'Due: ' + f.date}</div></div>
      <div class="card-badge" style="background:${f.paid ? '#DCFCE7' : '#FEE2E2'};color:${f.paid ? '#16A34A' : '#DC2626'}">${f.amount}</div>
    </div>`);

  // Notices
  renderCards('notices-list', notices, n => `
    <div class="card-item">
      <div class="card-icon" style="background:${n.color || '#FEF3C7'};color:${n.textColor || '#D97706'}">${n.icon || '📢'}</div>
      <div class="card-content"><div class="card-title">${n.title}</div><div class="card-sub">${n.date || ''} · ${n.from || 'School'}</div></div>
    </div>`);

  // Absences
  renderCards('absences-list', absences, a => `
    <div class="card-item">
      <div class="card-icon" style="background:#FEE2E2;color:#DC2626">✗</div>
      <div class="card-content"><div class="card-title">${a.date}</div><div class="card-sub">${a.reason || 'No reason provided'}</div></div>
    </div>`);

  /* ====== TEACHER DATA POPULATION ====== */
  const teacher = C.teacher || {};
  const students = teacher.students || [];
  const teacherHw = teacher.recentHomework || [];
  const teacherNotices = teacher.recentNotices || [];

  // Attendance list
  renderCards('teacher-attendance-list', students.slice(0, 10), (s, i) => {
    const states = ['present','absent','late'];
    const defaultState = i < 8 ? 'present' : (i === 8 ? 'absent' : 'late');
    return `
    <div class="attendance-row">
      <div class="student-avatar" style="background:${s.color || '#EEF2FF'};color:${s.textColor || '#6366F1'};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">${(s.name || '?')[0]}</div>
      <div class="att-student-info"><div class="att-student-name">${s.name}</div><div class="att-student-roll">Roll #${s.roll || i+1}</div></div>
      <div class="att-toggle">
        <div class="att-toggle-btn ${defaultState==='present'?'sel-present':''}" data-idx="${i}" data-val="present">P</div>
        <div class="att-toggle-btn ${defaultState==='absent'?'sel-absent':''}" data-idx="${i}" data-val="absent">A</div>
        <div class="att-toggle-btn ${defaultState==='late'?'sel-late':''}" data-idx="${i}" data-val="late">L</div>
      </div>
    </div>`;
  });

  // Teacher homework list
  renderCards('teacher-hw-list', teacherHw, h => `
    <div class="card-item">
      <div class="card-icon" style="background:#EEF2FF;color:#6366F1">📝</div>
      <div class="card-content"><div class="card-title">${h.subject}: ${h.title}</div><div class="card-sub">${h.class || ''} · ${h.date || 'Today'}</div></div>
    </div>`);

  // Teacher notices list
  renderCards('teacher-notices-list', teacherNotices, n => `
    <div class="card-item">
      <div class="card-icon" style="background:#FEF3C7;color:#D97706">📢</div>
      <div class="card-content"><div class="card-title">${n.title}</div><div class="card-sub">${n.target || 'All'} · ${n.date || 'Today'}</div></div>
    </div>`);

  // Students directory
  renderCards('teacher-students-list', students, (s, i) => `
    <div class="card-item">
      <div class="card-icon" style="background:${s.color || '#EEF2FF'};color:${s.textColor || '#6366F1'};font-weight:700">${(s.name || '?')[0]}</div>
      <div class="card-content"><div class="card-title">${s.name}</div><div class="card-sub">Roll #${s.roll || i+1} · ${s.parent || ''}</div></div>
    </div>`);

  /* ====== TAB NAVIGATION (independent per phone) ====== */
  document.querySelectorAll('.tab-bar .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const phone = tab.dataset.phone;
      const target = tab.dataset.tab;
      const container = phone === 'teacher'
        ? document.getElementById('teacher-phone')
        : document.getElementById('parent-phone');

      // Deactivate tabs
      container.querySelectorAll('.tab-bar .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Switch screen
      container.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      const screen = container.querySelector(`[data-screen="${target}"]`);
      if (screen) screen.classList.add('active');
    });
  });

  /* ====== QUICK ACTION CARDS ====== */
  document.querySelectorAll('.action-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.goto;
      const container = document.getElementById('teacher-phone');
      container.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      const screen = container.querySelector(`[data-screen="${target}"]`);
      if (screen) screen.classList.add('active');
      // Sync tab bar
      container.querySelectorAll('.tab-bar .tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === target);
      });
    });
  });

  /* ====== ATTENDANCE TOGGLE ====== */
  document.querySelectorAll('.att-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.att-toggle');
      row.querySelectorAll('.att-toggle-btn').forEach(b => {
        b.classList.remove('sel-present','sel-absent','sel-late');
      });
      const v = btn.dataset.val;
      btn.classList.add(v === 'present' ? 'sel-present' : v === 'absent' ? 'sel-absent' : 'sel-late');
    });
  });

  /* ====== BULK ATTENDANCE BUTTONS ====== */
  document.querySelectorAll('.present-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.screen-body').querySelectorAll('.att-toggle-btn').forEach(b => {
        b.classList.remove('sel-present','sel-absent','sel-late');
        if (b.dataset.val === 'present') b.classList.add('sel-present');
      });
    });
  });
  document.querySelectorAll('.absent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.screen-body').querySelectorAll('.att-toggle-btn').forEach(b => {
        b.classList.remove('sel-present','sel-absent','sel-late');
        if (b.dataset.val === 'absent') b.classList.add('sel-absent');
      });
    });
  });

  /* ====== CLASS CHIP SELECTION ====== */
  document.querySelectorAll('.class-selector').forEach(sel => {
    sel.querySelectorAll('.class-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sel.querySelectorAll('.class-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  /* ====== PILL TABS ====== */
  document.querySelectorAll('.tab-pills').forEach(pills => {
    pills.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  });

  /* ====== SUBMIT BUTTON FEEDBACK ====== */
  document.querySelectorAll('.submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = '✓ Done!';
      btn.style.opacity = '0.7';
      setTimeout(() => { btn.textContent = orig; btn.style.opacity = '1'; }, 1500);
    });
  });

})();
