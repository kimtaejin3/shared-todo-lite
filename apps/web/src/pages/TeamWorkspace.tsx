import { useState } from 'react'

interface TeamMember {
  id: number
  name: string
  avatar: string
  role: string
  tasksCompleted: number
  totalTasks: number
}

interface Task {
  id: number
  title: string
  time: string
  status: 'completed' | 'in-progress' | 'pending'
  assignee: string
  participants?: string[]
}

interface InviteRequest {
  id: number
  name: string
  avatar: string
  requestedAt: string
}

interface JoinRequest {
  id: number
  taskId: number
  taskTitle: string
  requesterName: string
  requesterAvatar: string
  assigneeName: string
  requestedAt: string
}

export default function TeamWorkspace() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showInviteRequests, setShowInviteRequests] = useState(false)
  const [showJoinRequests, setShowJoinRequests] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // 더미 초대 요청
  const [inviteRequests, setInviteRequests] = useState<InviteRequest[]>([
    { id: 1, name: 'John Doe', avatar: '👨🏽', requestedAt: '2 hours ago' },
    { id: 2, name: 'Jane Smith', avatar: '👩🏼', requestedAt: '5 hours ago' },
  ])

  // 할 일 참여 요청
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: 1, taskId: 3, taskTitle: 'Update dashboard UI', requesterName: 'Mike Chen', requesterAvatar: '👨🏼', assigneeName: 'Alex Johnson', requestedAt: '1 hour ago' },
    { id: 2, taskId: 3, taskTitle: 'Implement auth service', requesterName: 'Alex Johnson', requesterAvatar: '👨🏻', assigneeName: 'Sarah Kim', requestedAt: '30 min ago' },
  ])

  const teamMembers: TeamMember[] = [
    { id: 1, name: 'Alex Johnson', avatar: '👨🏻', role: 'Frontend Dev', tasksCompleted: 8, totalTasks: 12 },
    { id: 2, name: 'Sarah Kim', avatar: '👩🏻', role: 'Backend Dev', tasksCompleted: 10, totalTasks: 15 },
    { id: 3, name: 'Mike Chen', avatar: '👨🏼', role: 'Designer', tasksCompleted: 5, totalTasks: 8 },
    { id: 4, name: 'Emily Davis', avatar: '👩🏽', role: 'Product Manager', tasksCompleted: 12, totalTasks: 18 },
  ]

  const tasksByMember: Record<number, Task[]> = {
    1: [
      { id: 1, title: 'Implement login page', time: '9:00 AM', status: 'completed', assignee: 'Alex Johnson', participants: ['👩🏻', '👨🏼'] },
      { id: 2, title: 'Fix navigation bug', time: '11:00 AM', status: 'completed', assignee: 'Alex Johnson' },
      { id: 3, title: 'Update dashboard UI', time: '2:00 PM', status: 'in-progress', assignee: 'Alex Johnson', participants: ['👨🏼'] },
      { id: 4, title: 'Code review', time: '4:00 PM', status: 'pending', assignee: 'Alex Johnson' },
    ],
    2: [
      { id: 1, title: 'Database migration', time: '8:30 AM', status: 'completed', assignee: 'Sarah Kim' },
      { id: 2, title: 'API optimization', time: '10:00 AM', status: 'completed', assignee: 'Sarah Kim', participants: ['👨🏻'] },
      { id: 3, title: 'Implement auth service', time: '1:00 PM', status: 'in-progress', assignee: 'Sarah Kim', participants: ['👨🏻', '👩🏽'] },
      { id: 4, title: 'Write API docs', time: '3:30 PM', status: 'pending', assignee: 'Sarah Kim' },
    ],
    3: [
      { id: 1, title: 'Design mockups', time: '9:00 AM', status: 'completed', assignee: 'Mike Chen' },
      { id: 2, title: 'Create design system', time: '11:30 AM', status: 'in-progress', assignee: 'Mike Chen', participants: ['👨🏻', '👩🏻'] },
      { id: 3, title: 'User flow diagram', time: '2:00 PM', status: 'pending', assignee: 'Mike Chen' },
    ],
    4: [
      { id: 1, title: 'Sprint planning', time: '9:00 AM', status: 'completed', assignee: 'Emily Davis', participants: ['👨🏻', '👩🏻', '👨🏼', '👨🏽'] },
      { id: 2, title: 'Client meeting', time: '11:00 AM', status: 'completed', assignee: 'Emily Davis' },
      { id: 3, title: 'Review user feedback', time: '2:00 PM', status: 'in-progress', assignee: 'Emily Davis', participants: ['👨🏻'] },
      { id: 4, title: 'Update roadmap', time: '4:00 PM', status: 'pending', assignee: 'Emily Davis' },
    ],
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'pending': return 'Pending'
    }
  }

  const handleCopyInviteLink = () => {
    const dummyLink = 'https://shared-todo.app/invite/abc123xyz'
    navigator.clipboard.writeText(dummyLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAcceptInvite = (id: number) => {
    setInviteRequests(prev => prev.filter(req => req.id !== id))
    // TODO: API 호출하여 초대 수락
  }

  const handleRejectInvite = (id: number) => {
    setInviteRequests(prev => prev.filter(req => req.id !== id))
    // TODO: API 호출하여 초대 거절
  }

  const handleRequestJoin = (taskId: number, taskTitle: string, assigneeName: string) => {
    const newRequest: JoinRequest = {
      id: Date.now(),
      taskId,
      taskTitle,
      requesterName: 'You',
      requesterAvatar: '👤',
      assigneeName,
      requestedAt: 'Just now'
    }
    setJoinRequests(prev => [...prev, newRequest])
    // TODO: API 호출하여 참여 요청 전송
  }

  const handleAcceptJoinRequest = (id: number) => {
    setJoinRequests(prev => prev.filter(req => req.id !== id))
    // TODO: API 호출하여 참여 요청 수락
  }

  const handleRejectJoinRequest = (id: number) => {
    setJoinRequests(prev => prev.filter(req => req.id !== id))
    // TODO: API 호출하여 참여 요청 거절
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Team Workspace</h1>
        <p className="text-gray-500 text-sm">View your team members and their tasks</p>
        
        {/* Workspace Info Card */}
        <div className="bg-white p-4 rounded-2xl mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {teamMembers.length} members
              </span>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Invite
            </button>
          </div>

          {/* Invite Requests */}
          {inviteRequests.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowInviteRequests(!showInviteRequests)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {inviteRequests.length}
                  </span>
                  <span className="text-sm font-medium text-gray-700">Pending invites</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showInviteRequests ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showInviteRequests && (
                <div className="mt-3 space-y-2">
                  {inviteRequests.map(request => (
                    <div key={request.id} className="bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                          {request.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{request.name}</p>
                          <p className="text-xs text-gray-500">{request.requestedAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptInvite(request.id)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectInvite(request.id)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Join Task Requests */}
          {joinRequests.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowJoinRequests(!showJoinRequests)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {joinRequests.length}
                  </span>
                  <span className="text-sm font-medium text-gray-700">Join requests</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showJoinRequests ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showJoinRequests && (
                <div className="mt-3 space-y-2">
                  {joinRequests.map(request => (
                    <div key={request.id} className="bg-orange-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                          {request.requesterAvatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{request.requesterName}</p>
                          <p className="text-xs text-gray-600">
                            wants to join <span className="font-medium">"{request.taskTitle}"</span>
                          </p>
                          <p className="text-xs text-gray-500">{request.requestedAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptJoinRequest(request.id)}
                          className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectJoinRequest(request.id)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Invite to Workspace</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Share this link with your team members to invite them to this workspace.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm text-gray-600 truncate flex-1">
                  https://shared-todo.app/invite/abc123xyz
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyInviteLink}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!selectedMember ? (
        <div className="grid grid-cols-1 gap-4">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className="bg-white p-6 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                  {member.avatar}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-semibold">
                      {member.tasksCompleted}/{member.totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(member.tasksCompleted / member.totalTasks) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedMember(null)}
            className="flex items-center gap-2 text-blue-500 mb-6 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to team</span>
          </button>

          {(() => {
            const member = teamMembers.find(m => m.id === selectedMember)
            const tasks = tasksByMember[selectedMember] || []
            
            return (
              <>
                <div className="bg-white p-6 rounded-2xl mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                      {member?.avatar}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{member?.name}</h2>
                      <p className="text-gray-500">{member?.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">
                          {member?.tasksCompleted} of {member?.totalTasks} tasks completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.status === 'completed' 
                            ? 'border-green-500 bg-green-500' 
                            : task.status === 'in-progress'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {task.status === 'completed' && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {task.status === 'in-progress' && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          )}
                        </div>
                        {index < tasks.length - 1 && (
                          <div className="w-0.5 h-20 bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 bg-white p-4 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <span className="text-sm text-gray-400">{task.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                          {task.status !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRequestJoin(task.id, task.title, member?.name || '')
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                              Join
                            </button>
                          )}
                        </div>
                        
                        {/* Participants */}
                        {task.participants && task.participants.length > 0 && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Participants:</span>
                            <div className="flex -space-x-2">
                              {task.participants.map((avatar, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm border-2 border-white"
                                >
                                  {avatar}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </>
      )}
    </>
  )
}

