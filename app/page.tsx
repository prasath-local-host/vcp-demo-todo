'use client';

import { useEffect, useState, type FormEvent } from 'react';

type Task = { id: string; title: string; done: boolean; priority: 'Normal' | 'High' };
type Filter = 'All tasks' | 'To do' | 'Completed';
const storageKey = 'daylist.tasks.v1';
const examples: Task[] = [
  { id: 'welcome-1', title: 'Plan the next big idea', done: false, priority: 'High' },
  { id: 'welcome-2', title: 'Share a first draft with the team', done: false, priority: 'Normal' },
  { id: 'welcome-3', title: 'Make room for a quick coffee break', done: false, priority: 'Normal' },
  { id: 'welcome-4', title: 'Set up my workspace', done: true, priority: 'Normal' },
];
function validTasks(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.done === 'boolean' && ['Normal', 'High'].includes(t.priority)) && new Set(value.map(t => t.id)).size === value.length;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Normal');
  const [filter, setFilter] = useState<Filter>('All tasks');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [removed, setRemoved] = useState<{ task: Task; index: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === null) setTasks(examples);
      else { const parsed: unknown = JSON.parse(saved); if (!validTasks(parsed)) throw new Error(); setTasks(parsed); }
    } catch { setNotice('Saved tasks could not be loaded. Changes in this session may not be saved.'); }
    setReady(true);
  }, []);

  function update(next: Task[]) {
    setTasks(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setNotice('Browser storage is unavailable. Keep this tab open to retain your tasks.'); }
  }
  function add(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !ready) return;
    update([{ id: crypto.randomUUID(), title: title.trim(), done: false, priority }, ...tasks]);
    setTitle(''); setPriority('Normal'); setFilter('All tasks');
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    update(tasks.map(t => t.id === editing ? { ...t, title: draft.trim() } : t)); setEditing(null);
  }
  const completed = tasks.filter(t => t.done).length;
  const visible = tasks.filter(t => filter === 'All tasks' || (filter === 'Completed' ? t.done : !t.done));
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  return <div className="shell">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="Daylist home"><span className="brand-icon">✓</span> daylist<span className="brand-dot">.</span></a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <div className="nav-current"><span>☷</span> My tasks <span className="nav-count">{tasks.length}</span></div>
      <div className="side-note"><span className="spark">✳</span><h3>One thing at a time.</h3><p>Big ideas start with a small next step.</p></div>
      <div className="profile"><span className="avatar">D</span><div><strong>Demo workspace</strong><small>Your personal task list</small></div></div>
    </aside>
    <main>
      <header className="topbar"><span>Workspace <span className="crumb">/</span> <strong>My tasks</strong></span><span className="demo-pill"><i /> DEMO</span></header>
      <div className="content">
        <section className="intro"><div className="eyebrow">A LITTLE FOCUS GOES A LONG WAY</div><h1>Make space for what matters.</h1><p>A clear list. A fresh start. Let’s get a little more done.</p></section>
        <section className="summary" aria-label="Task summary">
          <div><span className="summary-label">On your list</span><strong>{tasks.length.toString().padStart(2, '0')}</strong><small>ideas into action</small></div>
          <div><span className="summary-label">Still to do</span><strong>{(tasks.length - completed).toString().padStart(2, '0')}</strong><small>one step at a time</small></div>
          <div className="progress-card"><span className="summary-label">Looking good</span><strong>{percent}<em>%</em></strong><div className="progress" role="progressbar" aria-label="Tasks completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width: `${percent}%`}} /></div><small>{completed} of {tasks.length} tasks completed</small></div>
        </section>
        <section className="task-panel">
          <div className="panel-heading"><div><h2>My tasks</h2><p>Your next steps, all in one place.</p></div><span className="list-mark">☷</span></div>
          <form className="add-form" onSubmit={add}>
            <span className="plus" aria-hidden="true">+</span><input aria-label="New task" placeholder="What would you like to get done?" maxLength={180} value={title} onChange={e => setTitle(e.target.value)} disabled={!ready} required />
            <select aria-label="Task priority" value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}><option>Normal</option><option>High</option></select>
            <button className="primary" disabled={!ready || !title.trim()}>Add task <span aria-hidden="true">↗</span></button>
          </form>
          <div className="filters" aria-label="Filter tasks">{(['All tasks', 'To do', 'Completed'] as Filter[]).map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}<span>{f === 'All tasks' ? tasks.length : f === 'To do' ? tasks.length - completed : completed}</span></button>)}</div>
          {!ready ? <p className="empty" role="status">Opening your workspace…</p> : visible.length === 0 ? <div className="empty"><span>✓</span><h3>{filter === 'Completed' ? 'Progress starts with one task.' : filter === 'To do' ? 'You’re all caught up.' : 'A clean slate.'}</h3><p>{filter === 'Completed' ? 'Completed tasks will appear here.' : 'Add a task above whenever inspiration strikes.'}</p></div> : <ul className="tasks">{visible.map(task => <li key={task.id} className={task.done ? 'done' : ''}>
            <input className="task-check" type="checkbox" checked={task.done} aria-label={`Complete ${task.title}`} onChange={() => update(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))} />
            {editing === task.id ? <form className="edit-form" onSubmit={save}><input aria-label="Edit task title" autoFocus value={draft} maxLength={180} onChange={e => setDraft(e.target.value)} onKeyDown={e => {if (e.key === 'Escape') setEditing(null);}} required /><button disabled={!draft.trim()}>Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></form> : <><span className="task-title">{task.title}</span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority === 'High' ? '↑ High priority' : 'Normal'}</span><div className="task-actions"><button aria-label={`Edit ${task.title}`} onClick={() => {setEditing(task.id); setDraft(task.title);}}>Edit</button><button aria-label={`Delete ${task.title}`} onClick={() => {setRemoved({task, index: tasks.indexOf(task)}); update(tasks.filter(t => t.id !== task.id));}}>×</button></div></>}
          </li>)}</ul>}
          <div className="panel-footer"><span>{tasks.length - completed} tasks left to make a difference.</span><span>Small steps, real progress <span aria-hidden="true">✳</span></span></div>
        </section>
        {removed && <div className="undo" role="status">Task removed.<button onClick={() => {const next = [...tasks]; next.splice(removed.index, 0, removed.task); update(next); setRemoved(null);}}>Undo</button><button aria-label="Dismiss notification" onClick={() => setRemoved(null)}>×</button></div>}
        {notice && <p className="notice" role="alert">{notice}</p>}
        <footer className="page-footer">Made for a clearer day.<span>Tasks are saved in this browser only.</span></footer>
      </div>
    </main>
  </div>;
}
