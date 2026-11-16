import { useEffect } from 'react';
import { Alert, DatePicker, Form, InputNumber, Modal, TimePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import { conflictResourceLabel, type LessonActionError } from '@/modules/schedule/utils/lessonErrors';
import { toSchoolDateTimeIso, wallClockInTimeZone } from '@/modules/schedule/utils/lessonTime';

interface RescheduleValues {
  date: Dayjs;
  time: Dayjs;
  durationMin: number;
}

interface RescheduleLessonModalProps {
  open: boolean;
  isSending: boolean;
  timezone: string;
  scheduledAt?: string;
  error?: LessonActionError | null;
  onClose: () => void;
  onSubmit: (body: { scheduledAt: string; durationMin: number }) => void;
}

export const RescheduleLessonModal = ({
  open,
  isSending,
  timezone,
  scheduledAt,
  error,
  onClose,
  onSubmit,
}: RescheduleLessonModalProps) => {
  const [form] = Form.useForm<RescheduleValues>();

  useEffect(() => {
    if (!open || !scheduledAt) return;
    const clock = wallClockInTimeZone(scheduledAt, timezone);
    form.setFieldsValue({
      date: dayjs(clock.date),
      time: dayjs(`${clock.date}T${clock.time}`),
      durationMin: 90,
    });
  }, [form, open, scheduledAt, timezone]);

  return (
    <Modal
      centered
      title="Перенести заняття"
      open={open}
      okText="Перенести"
      cancelText="Скасувати"
      confirmLoading={isSending}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() =>
        void form.validateFields().then((values) =>
          onSubmit({
            scheduledAt: toSchoolDateTimeIso(
              values.date.format('YYYY-MM-DD'),
              values.time.format('HH:mm'),
              timezone,
            ),
            durationMin: values.durationMin,
          }),
        )
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        {error ? (
          <Alert
            type="error"
            showIcon
            title={error.title}
            description={
              error.conflicts.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {error.conflicts.map((conflict) => (
                    <li key={`${conflict.lessonId}-${conflict.resource}`}>
                      {conflictResourceLabel(conflict.resource)}:{' '}
                      {formatLessonTime(conflict.scheduledAt, timezone)} —{' '}
                      {formatLessonTime(conflict.endsAt, timezone)}
                    </li>
                  ))}
                </ul>
              ) : undefined
            }
            style={{ marginBottom: 16 }}
          />
        ) : null}
        <Form.Item label="Дата" name="date" rules={[{ required: true, message: 'Оберіть дату' }]}>
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item label="Час початку" name="time" rules={[{ required: true, message: 'Оберіть час' }]}>
          <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={5} needConfirm={false} />
        </Form.Item>
        <Form.Item
          label="Тривалість, хв"
          name="durationMin"
          rules={[
            { required: true, message: 'Вкажіть тривалість' },
            { type: 'number', min: 15, max: 240, message: 'Від 15 до 240 хвилин' },
          ]}
        >
          <InputNumber min={15} max={240} step={15} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
