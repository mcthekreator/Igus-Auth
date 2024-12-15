import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserData {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	role: string;


	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;
}
