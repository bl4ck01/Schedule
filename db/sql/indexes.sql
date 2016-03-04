CREATE INDEX Default_Time_index_start_time ON Default_Time (start_time ASC);
CREATE INDEX Default_Time_index_end_time ON Default_Time (end_time DESC );

CREATE INDEX Assigned_Shift_index_start_time ON Assigned_Shift (start_time ASC);
CREATE INDEX Assigned_Shift_index_end_time ON Assigned_Shift (end_time DESC);

CREATE INDEX Trade_Request_index_start_time ON Trade_Request (start_time ASC);
CREATE INDEX Trade_Request_index_end_time ON Trade_Request (end_time DESC);