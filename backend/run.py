import uvicorn

if __name__ == "__main__":
    print("[+] Starting AgroConnect Backend API on http://0.0.0.0:8000 ...")
    print("[+] Local access: http://127.0.0.1:8000/docs")
    print("[+] Mobile / LAN access: http://172.20.10.2:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
