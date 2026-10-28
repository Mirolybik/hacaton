import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db';
import { Equipment } from '../equipment/equipment.model';

export const REQUEST_TYPES = ['inspection', 'repair'] as const;
export const REQUEST_PRIORITIES = ['low', 'normal', 'high'] as const;
export const REQUEST_STATUSES = ['new', 'in_progress', 'waiting_parts', 'done'] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  new: ['in_progress'],
  in_progress: ['waiting_parts', 'done'],
  waiting_parts: ['in_progress'],
  done: [],
};

export class Request extends Model {
  declare id: string;
  declare type: RequestType;
  declare equipmentId: string | null;
  declare description: string;
  declare priority: RequestPriority;
  declare status: RequestStatus;
  declare authorName: string;
  declare authorContact: string;
  declare assignee: string | null;
  declare dueAt: Date;
  declare diagnostics: string | null;
  declare workDescription: string | null;
  declare waitingComment: string | null;
  declare closingComment: string | null;
  declare completedAt: Date | null;
  declare overdue: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Request.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    equipmentId: {
      type: DataTypes.STRING(100),
      references: { model: Equipment, key: 'equipment_id' },
      onDelete: 'SET NULL',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'new',
    },
    authorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    authorContact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    assignee: {
      type: DataTypes.STRING(150),
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnostics: {
      type: DataTypes.TEXT,
    },
    workDescription: {
      type: DataTypes.TEXT,
    },
    waitingComment: {
      type: DataTypes.TEXT,
    },
    closingComment: {
      type: DataTypes.TEXT,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    overdue: {
      type: DataTypes.VIRTUAL,
      get() {
        const status = this.getDataValue('status');
        const dueAt = this.getDataValue('dueAt');
        return status !== 'done' && new Date(dueAt) < new Date();
      },
    },
  },
  {
    sequelize,
    tableName: 'requests',
    underscored: true,
  },
);

export class RequestHistory extends Model {
  declare id: string;
  declare requestId: string;
  declare userName: string;
  declare userRole: string;
  declare action: string;
  declare field: string | null;
  declare oldValue: string | null;
  declare newValue: string | null;
  declare createdAt: Date;
}

RequestHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Request, key: 'id' },
      onDelete: 'CASCADE',
    },
    userName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    userRole: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING(100),
    },
    oldValue: {
      type: DataTypes.TEXT,
    },
    newValue: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'request_history',
    underscored: true,
    updatedAt: false,
  },
);

Equipment.hasMany(Request, { foreignKey: 'equipmentId', as: 'requests' });
Request.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

Request.hasMany(RequestHistory, { foreignKey: 'requestId', as: 'history', onDelete: 'CASCADE' });
RequestHistory.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });
