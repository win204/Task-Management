USE [task_management]
GO
/****** Object:  Table [dbo].[activity_logs]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[activity_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[action] [nvarchar](100) NULL,
	[created_at] [datetime2](6) NULL,
	[description] [nvarchar](max) NULL,
	[task_id] [bigint] NULL,
	[user_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[attachments]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attachments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[file_name] [nvarchar](255) NULL,
	[file_path] [nvarchar](500) NULL,
	[uploaded_at] [datetime2](6) NULL,
	[task_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[positions]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[positions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[description] [varchar](255) NULL,
	[name] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[projects]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[projects](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[description] [varchar](255) NULL,
	[end_date] [date] NULL,
	[project_code] [varchar](255) NOT NULL,
	[project_name] [varchar](255) NOT NULL,
	[start_date] [date] NULL,
	[status] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[description] [varchar](255) NULL,
	[name] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tasks]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tasks](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](max) NULL,
	[due_date] [date] NULL,
	[priority] [varchar](255) NULL,
	[start_date] [date] NULL,
	[status] [varchar](255) NULL,
	[title] [nvarchar](255) NULL,
	[assignee_id] [bigint] NULL,
	[project_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_positions]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_positions](
	[user_id] [bigint] NOT NULL,
	[position_id] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[position_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_roles]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_roles](
	[user_id] [bigint] NOT NULL,
	[role_id] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 6/5/2026 6:13:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[email] [varchar](255) NULL,
	[full_name] [nvarchar](100) NULL,
	[password] [varchar](255) NULL,
	[phone] [varchar](20) NULL,
	[status] [bit] NULL,
	[username] [varchar](255) NULL,
	[active] [bit] NULL,
	[created_at] [datetime2](6) NULL,
	[updated_at] [datetime2](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[activity_logs] ON 

INSERT [dbo].[activity_logs] ([id], [action], [created_at], [description], [task_id], [user_id]) VALUES (2, N'CREATE_TASK', CAST(N'2026-06-04T16:25:25.1660960' AS DateTime2), N'Phong tạo task thiết kế database', 1, 1)
SET IDENTITY_INSERT [dbo].[activity_logs] OFF
GO
SET IDENTITY_INSERT [dbo].[attachments] ON 

INSERT [dbo].[attachments] ([id], [file_name], [file_path], [uploaded_at], [task_id]) VALUES (1, N'database.sql', N'uploads/database.sql', CAST(N'2026-06-04T16:40:56.5858730' AS DateTime2), 1)
SET IDENTITY_INSERT [dbo].[attachments] OFF
GO
SET IDENTITY_INSERT [dbo].[positions] ON 

INSERT [dbo].[positions] ([id], [description], [name]) VALUES (1, N'Java Spring Boot Developer', N'Backend Developer')
INSERT [dbo].[positions] ([id], [description], [name]) VALUES (2, N'ReactJS Developer', N'Frontend Developer')
INSERT [dbo].[positions] ([id], [description], [name]) VALUES (3, N'Software Tester', N'QA Tester')
SET IDENTITY_INSERT [dbo].[positions] OFF
GO
SET IDENTITY_INSERT [dbo].[projects] ON 

INSERT [dbo].[projects] ([id], [description], [end_date], [project_code], [project_name], [start_date], [status]) VALUES (1, N'Spring Boot Internship Project', CAST(N'2026-08-01' AS Date), N'PRJ001', N'Task Management System', CAST(N'2026-06-01' AS Date), N'IN_PROGRESS')
SET IDENTITY_INSERT [dbo].[projects] OFF
GO
SET IDENTITY_INSERT [dbo].[roles] ON 

INSERT [dbo].[roles] ([id], [description], [name]) VALUES (1, N'Administrator', N'ADMIN')
INSERT [dbo].[roles] ([id], [description], [name]) VALUES (2, N'Project Manager', N'MANAGER')
INSERT [dbo].[roles] ([id], [description], [name]) VALUES (3, N'Employee', N'EMPLOYEE')
SET IDENTITY_INSERT [dbo].[roles] OFF
GO
SET IDENTITY_INSERT [dbo].[tasks] ON 

INSERT [dbo].[tasks] ([id], [description], [due_date], [priority], [start_date], [status], [title], [assignee_id], [project_id]) VALUES (1, N'Thiết kế database cho hệ thống', CAST(N'2026-06-10' AS Date), N'HIGH', CAST(N'2026-06-04' AS Date), N'DONE', N'Thiết kế Database', 1, 1)
SET IDENTITY_INSERT [dbo].[tasks] OFF
GO
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (1, 1)
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([id], [email], [full_name], [password], [phone], [status], [username], [active], [created_at], [updated_at]) VALUES (1, N'admin@gmail.com', N'Phong Ho', N'123123', N'0123456789', NULL, N'admin', 1, CAST(N'2026-06-04T13:32:57.2920950' AS DateTime2), CAST(N'2026-06-04T13:32:57.2931050' AS DateTime2))
SET IDENTITY_INSERT [dbo].[users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK1batb7mq0elcfcs3d6maqo6sg]    Script Date: 6/5/2026 6:13:36 PM ******/
ALTER TABLE [dbo].[projects] ADD  CONSTRAINT [UK1batb7mq0elcfcs3d6maqo6sg] UNIQUE NONCLUSTERED 
(
	[project_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKofx66keruapi6vyqpv6f2or37]    Script Date: 6/5/2026 6:13:36 PM ******/
ALTER TABLE [dbo].[roles] ADD  CONSTRAINT [UKofx66keruapi6vyqpv6f2or37] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[activity_logs]  WITH CHECK ADD  CONSTRAINT [FK5bm1lt4f4eevt8lv2517soakd] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[activity_logs] CHECK CONSTRAINT [FK5bm1lt4f4eevt8lv2517soakd]
GO
ALTER TABLE [dbo].[activity_logs]  WITH CHECK ADD  CONSTRAINT [FKtoru9k6tjr6ifdjhood8onue8] FOREIGN KEY([task_id])
REFERENCES [dbo].[tasks] ([id])
GO
ALTER TABLE [dbo].[activity_logs] CHECK CONSTRAINT [FKtoru9k6tjr6ifdjhood8onue8]
GO
ALTER TABLE [dbo].[attachments]  WITH CHECK ADD  CONSTRAINT [FKq4u9ne3x0xtpc5d2jdddv1ii7] FOREIGN KEY([task_id])
REFERENCES [dbo].[tasks] ([id])
GO
ALTER TABLE [dbo].[attachments] CHECK CONSTRAINT [FKq4u9ne3x0xtpc5d2jdddv1ii7]
GO
ALTER TABLE [dbo].[tasks]  WITH CHECK ADD  CONSTRAINT [FKekr1dgiqktpyoip3qmp6lxsit] FOREIGN KEY([assignee_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[tasks] CHECK CONSTRAINT [FKekr1dgiqktpyoip3qmp6lxsit]
GO
ALTER TABLE [dbo].[tasks]  WITH CHECK ADD  CONSTRAINT [FKsfhn82y57i3k9uxww1s007acc] FOREIGN KEY([project_id])
REFERENCES [dbo].[projects] ([id])
GO
ALTER TABLE [dbo].[tasks] CHECK CONSTRAINT [FKsfhn82y57i3k9uxww1s007acc]
GO
ALTER TABLE [dbo].[user_positions]  WITH CHECK ADD  CONSTRAINT [FK49ffcx0xclhe2oof19cty66v0] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_positions] CHECK CONSTRAINT [FK49ffcx0xclhe2oof19cty66v0]
GO
ALTER TABLE [dbo].[user_positions]  WITH CHECK ADD  CONSTRAINT [FKqieyn6an8qsrf02uvgsieege6] FOREIGN KEY([position_id])
REFERENCES [dbo].[positions] ([id])
GO
ALTER TABLE [dbo].[user_positions] CHECK CONSTRAINT [FKqieyn6an8qsrf02uvgsieege6]
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD  CONSTRAINT [FKh8ciramu9cc9q3qcqiv4ue8a6] FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[user_roles] CHECK CONSTRAINT [FKh8ciramu9cc9q3qcqiv4ue8a6]
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD  CONSTRAINT [FKhfh9dx7w3ubf1co1vdev94g3f] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_roles] CHECK CONSTRAINT [FKhfh9dx7w3ubf1co1vdev94g3f]
GO
