import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";

export function HelpPage() {
  return (
    <PageLayout
      title="Помощь"
      subtitle="Короткие ответы на частые вопросы."
      breadcrumbs={[
        { to: "/", label: "Главная" },
        { label: "Помощь" },
      ]}
    >
      <div className="help-faq">
        <section className="card help-faq__block">
          <h2 className="help-faq__q">Как откликнуться на объект?</h2>
          <p className="muted">
            Зарегистрируйтесь как работник или бригада, откройте карточку объекта в{" "}
            <Link to="/feed">ленте</Link>, заполните форму отклика и отправьте её. Компания увидит отклик в карточке
            объекта и сможет написать вам в чат.
          </p>
        </section>
        <section className="card help-faq__block">
          <h2 className="help-faq__q">Что означают статусы объекта?</h2>
          <p className="muted">
            <strong>Черновик</strong> — видите только вы. <strong>Open / в работе</strong> — карточка в ленте для
            исполнителей. <strong>Закрыт / отменён</strong> — снята с рынка.
          </p>
        </section>
        <section className="card help-faq__block">
          <h2 className="help-faq__q">Как работает чат?</h2>
          <p className="muted">
            После отклика или из каталога исполнителей можно открыть диалог в разделе{" "}
            <Link to="/chats">Чаты</Link>. Уведомления о событиях — в{" "}
            <Link to="/notifications">Уведомления</Link>.
          </p>
        </section>
        <section className="card help-faq__block">
          <h2 className="help-faq__q">Забыли пароль?</h2>
          <p className="muted">
            Смена пароля после входа: раздел <Link to="/settings">Настройки</Link>. Восстановление по email в
            разработке — обратитесь в поддержку через контакты в профиле.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
