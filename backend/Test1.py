import os
from pymongo import MongoClient
import socket
import ClientMultiple


def connect_db(db_name):
    client = MongoClient('mongodb+srv://ritul:ritul123@cluster0.ecwzof7.mongodb.net/?retryWrites=true&w=majority')
    db = client[db_name]
    return db


def obtain_servers():
    db = connect_db("cloud-project-db")
    collection = db["servers"]
    ipaddress = []
    for x in collection.find():
        ipaddress.append(x['ip_address'])
        print(x)
    return ipaddress


def obtain_current_machine_ip_address():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return ip_address


def get_unique_usernames():
    db = connect_db("cloud-project-db")
    collection = db["users"]
    users = set()
    for entry in collection.find():
        users.add(entry['email'])
    return list(users)


def obtain_files_data(ip_address, username):
    db = connect_db("cloud-project-db")
    collection = db["singledocuments"]
    filenames = []
    query = {"fileIPaddress": ip_address, "fileUserid": username}
    entries = collection.find(query)
    print(entries)
    all_data = []
    for entry in entries:
        print('entry is', entry)
        print('entry filename is', entry['fileName'])
        filePath = entry['filePath']
        s = filePath.split('\\')
        filename = s[-1]
        data = {'fileName': entry['fileName'], 'filePath': entry['filePath'], 'fileType': entry['fileType'],
                'fileVerifiedStatus': entry['fileVerifiedStatus'], 'fileSize': entry['fileSize'],
                'fileUserid': entry['fileUserid'], 'fileIPaddress': entry['fileIPaddress'],
                'createdAt': '', 'updatedAt': '', 'fullFileName': filename}
        all_data.append(data)
        filenames.append(filename)
    
    return filenames, all_data


def updateEntry(filename, all_data, ip_address):
    print('all_data', all_data)
    for i in range(len(all_data)):
        entry = all_data[i]
        if entry['fullFileName'] == filename:
            entry.update({"fileIPaddress": ip_address})
            print('Entry just updated', entry)
            return entry


def update_files_data(file_to_be_sent):
    db = connect_db("cloud-project-db")
    # Code for inserting file names along with server address
    collection = db["singledocuments"]
    x = collection.insert_many(file_to_be_sent)
    # print list of the _id values of the inserted documents:
    print(x.inserted_ids)
    print("Updated Entries")


if __name__ == '__main__':
    # Obtaining the list of IP address from the MongoDB database
    server_addresses = obtain_servers()
    current_address = obtain_current_machine_ip_address()
    users = get_unique_usernames()
    files_to_be_sent = []
    files_to_update = []
    for address in server_addresses:
        if address != current_address:
            for user in users:
                if os.path.exists('uploads/{}'.format(user)):
                    current_server_files = list(os.listdir('uploads/{}'.format(user)))
                    filenames, all_data = obtain_files_data(ip_address=address, username=user)
                    filenames1, all_data1 = obtain_files_data(ip_address=current_address, username=user)
                    for file in current_server_files:
                        if file not in filenames or len(filenames) == 0:
                            print("file under username {} needs to be transferred from current system to {}".format(file, user, address))
                            file_to_send = {'username': user, 'filename': file, 'ip_address': address}
                            updatedEntry = updateEntry(file, all_data1, address)
                            print('updatedEntry', updatedEntry)
                            files_to_be_sent.append(file_to_send)
                            files_to_update.append(updatedEntry)
                print('*' * 100)

    print('Outside Loop: Files to be sent', files_to_be_sent)
    ClientMultiple.transfer_file(files_to_be_sent)
    print('Files to update', )
    update_files_data(files_to_update)