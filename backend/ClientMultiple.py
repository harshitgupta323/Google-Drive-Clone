import socket
import threading
import os
import buffer


def transfer_file(files_to_be_sent):

    for file_to_send in files_to_be_sent:
        HOST = file_to_send['ip_address']
        PORT = 5010
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((HOST, PORT))

        with s:
            sbuf = buffer.Buffer(s)
            # Send username
            sbuf.put_utf8(file_to_send['username'])
            # Send filename
            sbuf.put_utf8(file_to_send['filename'])
            # Send filesize
            filepath = os.path.join('uploads', file_to_send['username'], file_to_send['filename'])
            file_size = os.path.getsize(filepath)
            sbuf.put_utf8(str(file_size))
            # Send the actual file
            with open(filepath, 'rb') as f:
                sbuf.put_bytes(f.read())
            print('File Sent')
