import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialForm = {
  name: '',
  description: '',
  features: '',
  status: 'development',
  signup_url: '',
  demo_url: '',
  target_audience: '',
  release_date: '',
}

const AppManager = () => {
  const [apps, setApps] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchApps = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/apps/admin/all')
      setApps(res.data.apps || [])
    } catch (err) {
      toast.error('Failed to fetch apps')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await axios.put(`/api/apps/${editingId}`, form)
        toast.success('App updated!')
      } else {
        await axios.post('/api/apps', form)
        toast.success('App created!')
      }
      setForm(initialForm)
      setEditingId(null)
      fetchApps()
    } catch (err) {
      toast.error('Failed to save app')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = app => {
    setForm({
      ...app,
      features: Array.isArray(app.features) ? app.features.join(', ') : app.features || '',
      release_date: app.release_date ? app.release_date.slice(0, 10) : '',
    })
    setEditingId(app.id)
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this app?')) return
    setLoading(true)
    try {
      await axios.delete(`/api/apps/${id}`)
      toast.success('App deleted!')
      fetchApps()
    } catch (err) {
      toast.error('Failed to delete app')
    } finally {
      setLoading(false)
    }
  }

  const handleNotify = async id => {
    setLoading(true)
    try {
      await axios.post(`/api/apps/${id}/notify-early-access`)
      toast.success('Notification sent to early access users!')
    } catch (err) {
      toast.error('Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Qualitative Research Apps</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={handleSubmit}>
        <input name="name" className="input-field" placeholder="App Name" value={form.name} onChange={handleChange} required />
        <input name="target_audience" className="input-field" placeholder="Target Audience" value={form.target_audience} onChange={handleChange} />
        <input name="description" className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="features" className="input-field md:col-span-2" placeholder="Features (comma separated)" value={form.features} onChange={handleChange} />
        <input name="signup_url" className="input-field" placeholder="Signup URL" value={form.signup_url} onChange={handleChange} />
        <input name="demo_url" className="input-field" placeholder="Demo URL" value={form.demo_url} onChange={handleChange} />
        <select name="status" className="input-field" value={form.status} onChange={handleChange}>
          <option value="development">Development</option>
          <option value="beta">Beta</option>
          <option value="released">Released</option>
        </select>
        <input name="release_date" type="date" className="input-field" placeholder="Release Date" value={form.release_date} onChange={handleChange} />
        <button type="submit" className="btn-primary md:col-span-2" disabled={loading}>{editingId ? 'Update App' : 'Add App'}</button>
        {editingId && <button type="button" className="btn-secondary md:col-span-2" onClick={() => { setForm(initialForm); setEditingId(null); }}>Cancel</button>}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Target Audience</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Release Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-2 font-semibold">{app.name}</td>
                <td className="px-4 py-2">{app.target_audience}</td>
                <td className="px-4 py-2 capitalize">{app.status}</td>
                <td className="px-4 py-2">{app.release_date ? app.release_date.slice(0, 10) : ''}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="btn-secondary" onClick={() => handleEdit(app)}>Edit</button>
                  <button className="btn-outline" onClick={() => handleDelete(app.id)}>Delete</button>
                  <button className="btn-primary" onClick={() => handleNotify(app.id)}>Notify Early Access</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppManager 