import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection();
  const id = uuidV4();
  const password = await hash("SOpf@@BbdVsD", 8);

  await connection.query(
    `INSERT INTO users(id, name, email, username, password)
     VALUES('${id}', 'Gabriel Piccoli', 'gabriel.pdmarcos@gmail.com', 'admin', '${password}')
    `
  );

  await connection.close();
}

create().then(() => console.log("User admin created!"));
