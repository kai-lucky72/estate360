"""Download Unsplash images for Estate360 seed data.

Downloads African property photos and African professional portraits,
saves them locally under scripts/assets/ for upload to R2.
"""
import os
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE_DIR, "assets")
os.makedirs(OUT_DIR, exist_ok=True)

PROPERTIES = {
    "property_01.jpg": "photo-1568605114967-8130f3a36994",
    "property_02.jpg": "photo-1570129477492-45c003edd2be",
    "property_03.jpg": "photo-1512917774080-9991f1c4c750",
    "property_04.jpg": "photo-1580587771525-78b9dba3b914",
    "property_05.jpg": "photo-1600596542815-ffad4c1539a9",
    "property_06.jpg": "photo-1600585154340-be6161a56a0c",
    "property_07.jpg": "photo-1600566753190-17f0baa2a6c3",
    "property_08.jpg": "photo-1600607687939-ce8a6c25118c",
    "property_09.jpg": "photo-1600607687920-4e2a09cf159d",
    "property_10.jpg": "photo-1600585152220-90363fe7e115",
    "property_11.jpg": "photo-1600047509807-ba8f99d2cdde",
    "property_12.jpg": "photo-1600210492486-724fe5c67fb0",
    "property_13.jpg": "photo-1512453979798-5ea266f8880c",
    "property_14.jpg": "photo-1486406146926-c627a92ad1ab",
    "property_15.jpg": "photo-1448630360428-65456885c650",
    "property_16.jpg": "photo-1479839672679-a46483c0e7c8",
    "property_17.jpg": "photo-1502005229762-cf1b2da7c5d6",
    "property_18.jpg": "photo-1523217582562-09d0def993a6",
    "property_19.jpg": "photo-1416331108676-a22ccb276e35",
    "property_20.jpg": "photo-1567496898669-ee935f5f647a",
    "property_21.jpg": "photo-1583608205776-bfd35f0d9f83",
    "property_22.jpg": "photo-1582268611958-ebfd161ef9cf",
    "property_23.jpg": "photo-1592595896616-c37162298647",
    "property_24.jpg": "photo-1598928506311-c55ded91a20c",
    "property_25.jpg": "photo-1522708323590-d24dbb6b0267",
    "property_26.jpg": "photo-1560185893-a55cbc8c57e8",
    "property_27.jpg": "photo-1560185127-6ed189bf02f4",
    "property_28.jpg": "photo-1513584922202-7481c7296f6e",
    "property_29.jpg": "photo-1493809842364-78817add7ffb",
    "property_30.jpg": "photo-1506905925346-21bda4d32df4",
}

AGENTS = {
    "agent_01.jpg": "photo-1531123897727-8f129e1688ce",
    "agent_02.jpg": "photo-1507003211169-0a1dd7228f2d",
    "agent_03.jpg": "photo-1500648767791-00dcc994a43e",
    "agent_04.jpg": "photo-1494790108377-be9c29b29330",
    "agent_05.jpg": "photo-1506794778202-cad84cf45f1d",
    "agent_06.jpg": "photo-1524504388940-b1c1722653e1",
    "agent_07.jpg": "photo-1519085360753-af0119f7cbe7",
    "agent_08.jpg": "photo-1573496359142-b8d87734a5a2",
    "agent_09.jpg": "photo-1560250097-0b93528c311a",
    "agent_10.jpg": "photo-1580489944761-15a19d654956",
}


def download(photo_id, filename):
    url = f"https://images.unsplash.com/{photo_id}?w=1200&q=80&fm=jpg&fit=crop"
    dest = os.path.join(OUT_DIR, filename)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        if len(data) < 5000:
            print(f"SKIP {filename}: too small ({len(data)} bytes)")
            return False
        with open(dest, "wb") as f:
            f.write(data)
        print(f"OK   {filename}: {len(data)} bytes")
        return True
    except Exception as e:
        print(f"FAIL {filename}: {e}")
        return False


def main():
    ok = 0
    fail = 0
    for filename, photo_id in {**PROPERTIES, **AGENTS}.items():
        if download(photo_id, filename):
            ok += 1
        else:
            fail += 1
    print(f"\nDone: {ok} downloaded, {fail} failed -> {OUT_DIR}")


if __name__ == "__main__":
    main()
