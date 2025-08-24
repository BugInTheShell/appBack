import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Relation } from "typeorm";
import { User } from "./Users.js";
import { File_Privileges } from "../enums/privileges.js";

@Entity({ name: "user_file_privileges", schema: "public" })
export class UserFilePrivilege {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: "Id_user", type: "int" })
  idUser: number;

  @Column({ name: "Id_bucket", type: "varchar", length: 150 })
  idBucket: string; // ajusta el length según tu BD

  @Column({ name: "Id_file", type: "int" })
  idFile: number;

  @Column({
    name: "Privilege",
    type: "int",
    nullable: false,
    default: File_Privileges.Manzana,
  })
  privilege: File_Privileges;

  // Relaciones (opcional)
  @ManyToOne(() => User)
  user: Relation<User>;
}
