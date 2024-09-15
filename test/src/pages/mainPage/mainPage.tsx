import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainApiService } from "../../services/MainApiService";

interface Record {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export const MainPage: React.FC = () => {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<Record>>({
    companySigDate: new Date().toISOString(),
    employeeSigDate: new Date().toISOString(),
  });
  const [editingRecord, setEditingRecord] = useState<Partial<Record> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const apiService = new MainApiService();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiService.getUserDocs();
      console.log(result);
      setData(result);
    } catch (err) {
      navigate("/authorization");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const addedRecord = await apiService.createUserDoc(newRecord as Record);
      console.log(addedRecord);
      setData([...data, addedRecord]);
      setNewRecord({
        companySigDate: new Date().toISOString(),
        employeeSigDate: new Date().toISOString(),
      });
    } catch (err) {
      setError("Ошибка при добавлении записи.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await apiService.deleteUserDoc(id);
      setData(data.filter((record) => record.id !== id));
    } catch (err) {
      setError("Ошибка при удалении записи.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    setLoading(true);
    try {
      const updatedRecord = await apiService.updateUserDoc(
        editingRecord.id!,
        editingRecord as Record
      );
      setData(
        data.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );
      setEditingRecord(null);
    } catch (err) {
      setError("Ошибка при обновлении записи.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Record
  ) => {
    if (editingRecord) {
      setEditingRecord({
        ...editingRecord,
        [field]: e.target.value,
      });
    } else {
      setNewRecord({
        ...newRecord,
        [field]: e.target.value,
      });
    }
  };

  return (
    <Container>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Документы
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата подписи компании</TableCell>
              <TableCell>Имя компании</TableCell>
              <TableCell>Название документа</TableCell>
              <TableCell>Статус документа</TableCell>
              <TableCell>Тип документа</TableCell>
              <TableCell>Номер сотрудника</TableCell>
              <TableCell>Дата подписи сотрудника</TableCell>
              <TableCell>Имя сотрудника</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.companySigDate}</TableCell>
                <TableCell>{record.companySignatureName}</TableCell>
                <TableCell>{record.documentName}</TableCell>
                <TableCell>{record.documentStatus}</TableCell>
                <TableCell>{record.documentType}</TableCell>
                <TableCell>{record.employeeNumber}</TableCell>
                <TableCell>{record.employeeSigDate}</TableCell>
                <TableCell>{record.employeeSignatureName}</TableCell>
                <TableCell>
                  <Box sx={{ display: "block", width: "100%", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(record)}
                      sx={{ width: "100%", mb: 1 }}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDelete(record.id)}
                      sx={{ width: "100%" }}
                    >
                      Удалить
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editingRecord ? "Редактирование записи" : "Добавить новую запись"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Дата подписи компании"
            value={
              editingRecord?.companySigDate || newRecord.companySigDate || ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "companySigDate")
            }
            disabled
          />
          <TextField
            label="Имя компании"
            value={
              editingRecord?.companySignatureName ||
              newRecord.companySignatureName ||
              ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "companySignatureName")
            }
          />
          <TextField
            label="Название документа"
            value={editingRecord?.documentName || newRecord.documentName || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "documentName")
            }
          />
          <TextField
            label="Статус документа"
            value={
              editingRecord?.documentStatus || newRecord.documentStatus || ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "documentStatus")
            }
          />
          <TextField
            label="Тип документа"
            value={editingRecord?.documentType || newRecord.documentType || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "documentType")
            }
          />
          <TextField
            label="Номер сотрудника"
            value={
              editingRecord?.employeeNumber || newRecord.employeeNumber || ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "employeeNumber")
            }
          />
          <TextField
            label="Дата подписи сотрудника"
            value={
              editingRecord?.employeeSigDate || newRecord.employeeSigDate || ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "employeeSigDate")
            }
            disabled
          />
          <TextField
            label="Имя сотрудника"
            value={
              editingRecord?.employeeSignatureName ||
              newRecord.employeeSignatureName ||
              ""
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "employeeSignatureName")
            }
          />
          {editingRecord ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEdit}
            >
              Сохранить изменения
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Добавить запись
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
