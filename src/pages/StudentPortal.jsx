import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Ticket, Clock, CheckCircle, Loader, Search } from 'lucide-react'
import { tickets as initialTickets } from '../data/mockTicketsData'
import TicketCard from '../components/TicketCard'
import TicketForm from '../components/TicketForm'
import { format } from 'date-fns'

const StudentPortal = ({ user, onAddNotification }) => {
  const [tickets, setTickets] = useState(initialTickets)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [viewScope, setViewScope] = useState('mine') // 'mine' or 'all'

  const handleCreateTicket = (ticketData) => {
    const newTicket = {
      id: tickets.length + 1,
      ...ticketData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null,
      comments: [],
    }

    setTickets([newTicket, ...tickets])
    
    // Add notification for ticket creation
    if (onAddNotification) {
      onAddNotification(
        'Ticket Created',
        `Your ticket "${ticketData.title}" has been created successfully`
      )
    }
  }

  const myTickets = tickets.filter((ticket) => ticket.studentId === user.id)
  const displayedTickets = viewScope === 'all' ? tickets : myTickets

  const filteredTickets = displayedTickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const stats = {
    total: displayedTickets.length,
    pending: displayedTickets.filter((t) => t.status === 'pending').length,
    inProgress: displayedTickets.filter((t) => t.status === 'in-progress').length,
    resolved: displayedTickets.filter((t) => t.status === 'resolved').length,
  }

  return (
    <div className="container-bordered py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {viewScope === 'all' ? 'All Tickets' : 'My Tickets'}
            </h1>
            <p className="text-gray-600">Track and manage your support requests</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewScope('mine')}
              className={`btn-secondary ${viewScope === 'mine' ? 'btn-primary' : ''}`}
            >
              My Tickets
            </button>
            <button
              onClick={() => setViewScope('all')}
              className={`btn-secondary ${viewScope === 'all' ? 'btn-primary' : ''}`}
            >
              View All Tickets
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary ml-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Ticket
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-pending">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-pending/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-pending" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-inProgress">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-inProgress/10 rounded-lg flex items-center justify-center">
              <Loader className="w-6 h-6 text-inProgress" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-resolved">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-resolved/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-resolved" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your tickets..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-12"
          >
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {viewScope === 'mine' && myTickets.length === 0
                ? 'You have not created any tickets yet.'
                : 'No tickets found matching your filters.'}
            </p>
            {viewScope === 'mine' && myTickets.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary mt-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Ticket
              </button>
            )}
          </motion.div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TicketCard
                ticket={ticket}
                isAdmin={false}
                onClick={() => setSelectedTicket(ticket)}
              />
            </motion.div>
          ))
        )}
      </div>

      {selectedTicket && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTicket(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6 text-gray-500 rotate-45" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedTicket.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                    <span>ID: #{selectedTicket.id}</span>
                    <span>•</span>
                    <span>{format(selectedTicket.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="panel-bordered">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`badge badge-${selectedTicket.status === 'pending' ? 'pending' : selectedTicket.status === 'in-progress' ? 'in-progress' : 'resolved'}`}>
                      {selectedTicket.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="panel-bordered">
                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTicket.priority === 'high'
                        ? 'bg-danger/10 text-danger'
                        : selectedTicket.priority === 'medium'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <div className="panel-bordered">
                    <p className="text-gray-600">{selectedTicket.description}</p>
                  </div>
                </div>

                {selectedTicket.assignedTo && (
                  <div className="panel-bordered">
                    <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-800">{selectedTicket.assignedTo}</p>
                  </div>
                )}

                {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Updates</p>
                    <div className="space-y-3">
                      {selectedTicket.comments.map((comment) => (
                        <div key={comment.id} className="panel-bordered">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-800 text-sm">{comment.author}</p>
                            <p className="text-xs text-gray-500">
                              {format(comment.timestamp, 'MMM dd, HH:mm')}
                            </p>
                          </div>
                          <p className="text-gray-600 text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}

      <TicketForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTicket}
        user={user}
      />
    </div>
  )
}

export default StudentPortal